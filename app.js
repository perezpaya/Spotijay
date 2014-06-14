var sp = require('libspotify');
var async = require('async');
var downloadTrack = require(__dirname + '/lib/download_track');

var session = new sp.Session({
    applicationKey: __dirname + '/spotify_appkey.key'
});

var path = __dirname + '/test_downloads';

session.login(config.user, config.password);

session.once('login', function(err) {
    if(err) this.emit('error', err);
    
    console.log('Logged');

    var playlist = sp.Playlist.getFromUrl('spotify:user:alexperezpaya:playlist:12vj5rxbMakEJHWk2s7Y9p');

    playlist.whenReady(function (){
        
        console.log('Ready')
        
        playlist.getTracks(function (tracks){
            
            //console.log('Downloading ' + tracks.length + ' tracks in playlist');

            async.mapSeries(tracks, function (track, callback){
                
                downloadTrack(track, session, path, callback);

            }, function (err){
                console.log(err);
            });

        });
    });

});

session.on('error', function (err){
    console.log(err);
    session.close();
    process.exit();
});
