var async = require('async');
var sp = require('libspotify');

var downloadTrack = require(__dirname + '/download_track')

module.exports = function (session){

    return function (url, path, callback){
        var track = sp.Track.getFromUrl(url);
            
        track.on('ready', function() {
                
            downloadTrack(session)(track, path, callback);

        });
    }

}