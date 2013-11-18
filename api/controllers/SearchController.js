/**
 * SearchController
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

var request = require('request');

module.exports = {
    
  search: function(req, res) {
  	var query = req.param('query');
    query = String(query).replace(/\s/g, "+");
    console.log(query);
  	var uri = 'https://itunes.apple.com/search?term='+query+'&limit=10';
  	request({uri: uri, json: true}, function (err, reply, data) {
  	   if (!err && reply.statusCode == 200) {
  	    res.json(data);
  	   };
	   });
  	},


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SearchController)
   */
  _config: {}

  
};
