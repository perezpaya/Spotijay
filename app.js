var async = require('async'),
    fs = require('fs');

var configPath = __dirname + '/config.json',
    config = require(configPath),
    path = config.dirname;

var Spotify = require(__dirname + '/lib/spotify');

var argv = require('minimist')(process.argv.slice(2));

function switchCb(err) {
    if (err)
        console.log(err);
    process.exit();
}

Spotify(config.username, config.password, function (err, spotify){

    switch (argv._[0]){
        case 'help':
            console.log('helping');

        case 'config':
            
            var user = argv['u'] || argv['username'] || argv['user']
            var pass = argv['p'] || argv['password'] || argv['pass']
            
            var dir = argv['d'] || argv['dir'] || argv['dirname']

            var newConf = config;

            newConf.username = user || newConf.username;
            newConf.password = pass || newConf.password;

            if(dir){
                if (dir == '.'){dir = process.cwd()} else if (dir.substring(0, 0) !== '/'){dir = process.cwd() + '/' + dir}
                console.log('Download path set to: ' + dir);
                newConf.dirname = dir;
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