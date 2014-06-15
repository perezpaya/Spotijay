var async = require('async');
var fs = require('fs');

var configPath = __dirname + '/config.json';
var config = require(configPath);

var path = __dirname + '/test_downloads';
var Spotify = require(__dirname + '/lib/spotify');

var argv = require('minimist')(process.argv.slice(2));

var switchCb = function (err) {
    if(err){
        console.log(err);
    }

    process.exit();
}

Spotify(config.username, config.password, function (err, spotify){

    switch (argv._[0]){
        case 'help':
            console.log('helping');

        case 'config':
            
            var user = argv['u'] || argv['username'] || argv['user']
            var pass = argv['p'] || argv['password'] || argv['pass']
            
            var newConf = config;

            if(user){
                newConf.username = user;
            }

            if(pass){
                newConf.password = pass;
            }
            fs.writeFileSync(configPath, JSON.stringify(newConf));
            process.exit();
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