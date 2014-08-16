var async = require('async'),
    fs = require('fs'),
    path = require('path');

var configPath = __dirname + '/config.json';

try {
    var config = require(configPath);
}
catch (e){
    var exist = fs.existsSync(configPath);
    if(exist !== true){
        fs.writeFileSync(configPath, '{}');
        var config = require(configPath);
    } else{
        throw e;
    }
}

var downloadPath = config.dirname;

var Spotify = require(__dirname + '/lib/spotify');

var argv = require('minimist')(process.argv.slice(2));

function switchCb(err) {
    if (err)
        console.log(err);
    process.exit();
}

var cmd = (argv['h']) ? 'help' : argv._[0]; 

switch (cmd){
    case 'help':
        console.log('Help disabled by the moment');

    case 'config':
        
        var user = argv['u'] || argv['username'] || argv['user'];
        var pass = argv['p'] || argv['password'] || argv['pass'];
        
        var dir = argv['d'] || argv['dir'] || argv['dirname'];

        var copyDestiny = argv['c'] || argv['cop'] || argv['copy'];

        var itunes = argv['itunes'];

        var newConf = config;

        newConf.username = user || newConf.username;
        newConf.password = pass || newConf.password;

        if(dir && typeof dir == 'string'){
            if (dir == '.'){dir = process.cwd()} else if (dir.substring(0, 0) !== '/'){dir = process.cwd() + '/' + dir}
            dir = path.resolve(dir);
            console.log('Download path set to: ' + dir);
            newConf.dirname = dir;
        }

        if(copyDestiny && typeof copyDestiny == 'string'){
            if (copyDestiny == '.'){copyDestiny = process.cwd()} else if (copyDestiny.substring(0, 0) !== '/'){copyDestiny = process.cwd() + '/' + copyDestiny}
            copyDestiny = path.resolve(copyDestiny);
            console.log('Copy path: ' + copyDestiny);
            newConf.copy = copyDestiny;
        }

        if(itunes == 'true'){
            newConf.itunes = true;
        } else if (itunes == 'false'){
            newConf.itunes = false;
        }

        fs.writeFileSync(configPath, JSON.stringify(newConf));
        process.exit();
        break;
    case 'playlist':
        if(!argv._[1]){
            console.log('You must provide a playlist url');
            process.exit();
        }

        Spotify(config.username, config.password, function (err, spotify){
            spotify.downloadPlaylistByUrl(argv._[1], downloadPath, switchCb);
        });
        break;
    case 'track':
        if(!argv._[1]){
            console.log('You must provide a track url');
            process.exit();
        }
        Spotify(config.username, config.password, function (err, spotify){
            spotify.getTrackByUrl(argv._[1], downloadPath, switchCb);
        });
        break;
    case 'search':
        break;

    case 'clean':
        require('child_process').exec('cd '+ config.dirname +' && rm -rf *.png *.wav *.raw', function (err, stdout) {
            console.log(err || 'Cleaned');
            if(err) process.exit(1)
            process.exit(0)
        });
        break;

    default:
        console.log('Use `$ spotijay help` to list different commands');
        process.exit();

}