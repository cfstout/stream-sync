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
  	var audio = req.param('audio');
  	var curTime = req.param('curTime');
  	audio.curTime = curTime;
  	Audio.publishUpdate(audio.id, {curTime: curTime});
  	audio.save(function(err) {
		if (err) {
			return console.log("audio save fucked up");
		}
	});
  },
  syncTime: function(req, res) {
  	Audio.subscribe(req.socket, audio);
  },
  unsyncTime: function(req, res) {
  	Audio.unsubscribe(req.socket);
  },

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AudioController)
   */
  _config: {}

  
};
