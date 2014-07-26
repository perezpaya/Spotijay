var async = require('async'),
    sp = require('libspotify');

module.exports = function (session){

    var downloadTrack = require(__dirname + '/download_track')(session);

    function downloadPlaylist (url, path, callback){
        
        var args = arguments;

        var playlist = sp.Playlist.getFromUrl(url);

        playlist.whenReady(function (){
            
            playlist.getTracks(function (tracks){

                var left = tracks.length;

                if(left){
                    async.mapSeries(tracks, function (track, callback){
                        
                        console.log('%d tracks left', left)
                        left--;
                        downloadTrack(track, path, callback);

                    }, function (err){
                        callback(err);
                    });
                } else{
                    setTimeout(function (){downloadPlaylist.apply(args)}, 60 * 1000);
                }
            });

        });

    }

    return downloadPlaylist

}