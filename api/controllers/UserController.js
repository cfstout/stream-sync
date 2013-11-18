/**
 * UserController
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

var passport = require('passport');

module.exports = {
    
	signup: function (req, res) {
		User.create({
			username: req.param('username'),
			password: req.param('password')
		}).done(function(err, user) {
			if (err) {
				console.log(err);
				return res.send(err, 500);
			}
			console.log("User created: " + user.username);
			return res.redirect('/u/' + user.username);
		});
	},
	find: function (req, res) {
		var username = req.param('username');
		User.findOne({username: username}, (function (err, user){
			if (!user) {
				err = 'No User found with username: ' + username;
				return res.json(err, 500);
			};
			return res.view({user: user}, 'user/profile');
		}));
	},
	test: function (req, res) {
		res.send(req.user);
	},

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {}

  
};
