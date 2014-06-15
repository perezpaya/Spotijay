var async = require('async');
var fs = require('fs');
var exec = require('child_process').exec;

module.exports = function (session){
    return function (track, path, callback){
        
        console.log('Downloading: ' + track.title + ' by ' + track.artist.name);
        
        var player = session.getPlayer();

        var regex = /[\:\^\`\'\"\*\\\]\[\{\}\/\s\(\)]/g;

        if(!(fs.existsSync(path + '/' + track.artist.name.replace(regex, '_') + '/' + track.album.name.replace(regex, '_')))){
            
            if(!(fs.existsSync(path + '/' + track.artist.name.replace(regex, '_')))){
                fs.mkdirSync(path + '/' + track.artist.name.replace(regex, '_'))
            }
            
            fs.mkdirSync(path + '/' + track.artist.name.replace(regex, '_') + '/' + track.album.name.replace(regex, '_'))

        }

        var destiny = path + '/' + track.artist.name.replace(regex, '_') + '/' + track.album.name.replace(regex, '_') + '/' + track.name.replace(regex, '_');

        if(fs.existsSync(destiny + '.mp3')){
            console.log('Already downloaded');
            return callback(null);
        }

        var ws = fs.createWriteStream(destiny + '.raw');

        player.load(track);
        player.play();

        player.pipe(ws);
        player.once('track-end', function() {
            player.stop();
            ws.end();

            async.waterfall([

                function (callback){
                    exec('sox ' + [
                        '-r', 44100,
                        '-b', 16,
                        '-L',
                        '-c', 2,
                        '-e', 'signed-integer',
                        '-t', 'raw',
                        destiny + '.raw',
                        destiny + '.wav'].join(' '), function (err){callback(err)});
                }, function (callback){
                    exec('lame ' + [
                        '--preset', 'insane',
                        '-b', 320,
                        '-h',
                        destiny + '.wav',
                        destiny + '.mp3'].join(' '), function (err){callback(err)});
                }, function (callback){
                    track.album.coverImage(function (err, buffer){
                        if(err){ return callback(err)}
                        
                        if(!buffer){
                            return callback(err, false);
                        }

                        fs.writeFile(destiny + '.png', buffer, function (err){
                            callback(err);
                        });
                    }); 
                }, function (cover, callback){

                    var cover = ['--add-image', destiny + '.png:FRONT_COVER',];

                    var args = [
                        '-t', '"'+track.title+'"',
                        '-a', '"'+track.artist.name+'"',
                        '-A', '"'+track.album.name+'"',
                        '-Y', '"'+track.album.year+'"',
                        '-Q',
                        destiny +'.mp3'
                    ]

                    if (cover){
                        args = cover.concat(args); // Adds the command to add a ilustration to the file
                    }

                    var cmd = 'eyeD3 ' + args.join(' ');
                    
                    exec(cmd, function (err){callback(err)});

                }, function (callback){
                    var shit = [destiny + '.raw', destiny + '.wav', destiny + '.png'];
                    async.map(shit, fs.unlink, callback)
                }

            ], function (err){
                console.log('Done');
                ws.end()
                delete player, ws
                callback(err);
            });

        });

        player.on('error', function (err){
            ws.end();
            callback(err);
        });
    }
}