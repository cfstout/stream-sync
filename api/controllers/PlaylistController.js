/**
 * PlaylistController
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
  	Audio.create({
  		artist: req.param('artist'),
  		track: req.param('track'),
  		curTime: 0
  	}).done(function(err, audio) {
  		if (!audio) {
			err = "Audio could not be created";
		}
		if (err) {
		  console.log(err);
		  return res.send(err, 500);
		}
		Playlist.findOne(req.param('playlistid'), function(err, playlist) {
			if (!playlist) {
				err = "Playlist could not be found";
			}
			if (err) {
			  console.log(err);
			  return res.send(err, 500);
			}
			playlist.audio.push(audio.id);

			Playlist.publishUpdate(playlist.id, {audio: audio});
			playlist.save(function(err) {
				if (err) {
					return console.log("playlist save fucked up");
				}
			});
			// sails.io.emit('added_song_to'+playlist.id, {audio: audio});
		});
  	});
  },
  current: function(req, res) {
  	Playlist.findOne(req.param('playlistid'), function(err, playlist) {
  		if (!playlist) {
			err = "Playlist could not be found";
		}
		if (err) {
		  console.log(err);
		  return res.send(err, 500);
		}
		Playlist.subscribe(req.socket, playlist);
		Audio.find({where: {id: playlist.audio}}, function(err, data) {
			if (err) {
				console.log(err);
				return res.send(err, 500);
			}
			return res.send({audio: data, curTrack: playlist.curTrack});
		});
  	});
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to PlaylistController)
   */
  _config: {}

  
};
