/**
 * AudioController
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
    
  updateTime: function(req, res) {
  	Audio.findOne(req.param('audio_id'), function(err, audio) {
  		if (err || !audio) return console.log("coudn't find audio with: "+ req.param('audio_id'));
	  	var curTime = req.param('curTime');
      var atTime = req.param('hostTime');
	  	audio.curTime = curTime;
      audio.atTime = atTime;
	  	Audio.publishUpdate(audio.id, {curTime: curTime, hostTime: atTime});
	  	audio.save(function(err) {
			if (err) {
				return console.log("audio save fucked up");
			}
		});
	});
  },
  syncTime: function(req, res) {
  	Audio.findOne(req.param('audio_id'), function(err, audio) {
  		if (! err && audio) Audio.subscribe(req.socket, audio);
  		else console.log("errors with syncTime");
  	});
  },
  unsyncTime: function(req, res) {
  	Audio.unsubscribe(req.socket, req.param('audio_id'));
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AudioController)
   */
  _config: {}

  
};
