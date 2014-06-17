var async = require('async'),
    sp = require('libspotify');

module.exports = function (session){

    var downloadTrack = require(__dirname + '/download_track')(session);

    return function (url, path, callback){
        
        var playlist = sp.Playlist.getFromUrl(url);

        playlist.whenReady(function (){
            
            playlist.getTracks(function (tracks){

                async.mapSeries(tracks, function (track, callback){
                    
                    downloadTrack(track, path, callback);

                }, function (err){
                    callback(err);
                });
            });

        });

    }

}