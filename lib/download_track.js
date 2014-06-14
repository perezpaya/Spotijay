var async = require('async');
var fs = require('fs');
var exec = require('child_process').exec;

module.exports = function (track, session, path, callback){
    
    console.log('Downloading: ' + track.title + ' by ' + track.artist.name);
    
    var player = session.getPlayer();

    var regex = /[\:\^\`\'\"\]\[\{\}\/\s]/g;

    if(!(fs.existsSync(path + '/' + track.artist.name.replace(regex, '_') + '/' + track.album.name.replace(regex, '_')))){
        
        if(!(fs.existsSync(path + '/' + track.artist.name.replace(regex, '_')))){
            fs.mkdirSync(path + '/' + track.artist.name.replace(regex, '_'))
        }
        
        fs.mkdirSync(path + '/' + track.artist.name.replace(regex, '_') + '/' + track.album.name.replace(regex, '_'))

    }

    var destiny = path + '/' + track.artist.name.replace(regex, '_') + '/' + track.album.name.replace(regex, '_') + '/' + track.name.replace(regex, '_');

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
                    fs.writeFile(destiny + '.png', buffer, function (err){
                        callback(err);
                    });
                }); 
            }, function (callback){
                var cmd = 'eyeD3 ' + [
                    '--add-image', destiny + '.png:FRONT_COVER',
                    '-t', '"'+track.title+'"',
                    '-a', '"'+track.artist.name+'"',
                    '-A', '"'+track.album.name+'"',
                    '-Y', '"'+track.album.year+'"',
                    '-Q',
                    destiny +'.mp3'
                ].join(' ');
                exec(cmd, function (err){callback(err)});
            }, function (callback){
                var shit = [destiny + '.raw', destiny + '.wav', destiny + '.png'];
                async.map(shit, fs.unlink, callback)
            }

        ], function (err){
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