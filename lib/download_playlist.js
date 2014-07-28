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
                        process.stdout.write('\r\033[KTracks left: ' + left);
                        left--;
                        downloadTrack(track, path, callback);

                    }, function (err){
                        if(err){
                            callback(err);
                        } else{
                            process.stdout.write('\r\033[K' + ' Downloaded all tracks')
                            setTimeout(function (){downloadPlaylist.apply(downloadPlaylist, args)}, 60 * 1000);
                        }
                    });

                } else{
                    process.stdout.write('\r\033[K' + 'There are no tracks on this playlist')
                    setTimeout(function (){downloadPlaylist.apply(downloadPlaylist, args)}, 60 * 1000);
                }
            });

        });

    }

    return downloadPlaylist

}