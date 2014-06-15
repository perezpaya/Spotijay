var async = require('async');
var config = require(__dirname + '/config.json');

var argv = require('minimist')(process.argv.slice(2));

var path = __dirname + '/test_downloads';
var Spotify = require(__dirname + '/lib/spotify');

var switchCb = function (err) {
    if(err){
        console.log(err);
    }

    process.exit();
}

Spotify(config.username, config.password, function (err, spotify){

    switch (argv._[0]){

        case 'config':
            break;
        case 'playlist':
            if(!argv._[1]){
                console.log('You must provide a playlist url');
                process.exit();
            }
            spotify.downloadPlaylistByUrl(argv._[1], path, switchCb);
            break;
        case 'track':
            if(!argv._[1]){
                console.log('You must provide a track url');
                process.exit();
            }
            spotify.getTrackByUrl(argv._[1], path, switchCb);
            break;
        case 'search':
            break;
        default:
            console.log('Use `$ spotijay help` to list different commands');
            process.exit();

    }

});