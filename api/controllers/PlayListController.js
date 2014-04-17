/**
 * PlayListController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

    addSong: function(req, res) {
        var song = req.param('song');
        PlayList.findOne(req.param('id')).done(function(err, playlist) {
            if (err || typeof playlist == 'undefined') {
                return res.send({error: err, status: 500}, 500);
            }
            playlist.songs.push(song);
            var uninitialized = playlist.current < 0;
            if (uninitialized) {
                playlist.current = 0;
            }
            playlist.save(function(err) {
                if (err) {
                    return res.send({error: err, status: 500}, 500);
                }
                PlayList.publishUpdate(playlist.id, {
                    meta: 'song_added',
                    song: song,
                    songs: playlist.songs
                });
                if (uninitialized) {
                    PlayList.publishUpdate(playlist.id, {
                        meta: 'initialized',
                        song: song
                    });
                }
                return res.send({status: 200}, 200);
            });
        });
    },
    sync: function(req, res) {
        PlayList.publishUpdate(req.param('id'), {
                meta: 'time_update',
                songTime: req.param('songTime'),
                hostTime: req.param('hostTime'),
                isPlaying: req.param('isPlaying'),
                current: req.param('current')
            });
        PlayList.findOne(req.param('id')).done(function(err, playlist) {
            if (err || typeof playlist == 'undefined') {
                return res.send({error: err, status: 500}, 500);
            }
            playlist.songTime = req.param('songTime');
            playlist.hostTime = req.param('hostTime');
            playlist.isPlaying = req.param('isPlaying');
            playlist.current = req.param('current');
            playlist.save(function(err) {
                if (err) {
                    return res.send({error: err, status: 500}, 500);
                }
                return res.send({status: 200}, 200);
            });
        });
    },
    getSongs: function(req, res) {
        console.log("Here");
        PlayList.findOne(req.param('id')).done(function(err, playlist){
            if(err || typeof playlist == 'undefined'){
                return res.send({error: err, status: 500}, 500);
            }
            console.log(playlist.songs)
            res.send({songs:playlist.songs, status: 200},200);
        });
    },

    /**
    * Overrides for the settings in `config/controllers.js`
    * (specific to PlayListController)
    */
    _config: {}

  
};
