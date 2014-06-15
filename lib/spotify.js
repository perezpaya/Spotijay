
var config = require(__dirname + '/../config.json')

var sp = require('libspotify');

var session = new sp.Session({
    applicationKey: __dirname + '/../spotify_appkey.key'
});

module.exports = function (username, password, cb){

    var downloadTrack = require(__dirname + '/download_track');
    var downloadPlaylist = require(__dirname + '/download_playlist');
    var getTrackByUrl = require(__dirname + '/get_track');

    session.login(username, password);

    session.once('login', function(err) {

        cb(null, {
            downloadTrack: downloadTrack(session),
            downloadPlaylistByUrl: downloadPlaylist(session),
            getTrackByUrl: getTrackByUrl(session)
        });

    });

    session.on('error', function (err){
        cb(err);
        session.close();
        process.exit();
    });

}