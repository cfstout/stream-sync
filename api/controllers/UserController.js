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

	/**
	* Authentication functions
	*/

	signup: function (req, res) {
		User.create({
			username: req.param('username'),
			password: req.param('password')
		}).done(function(err, user) {
			if (err) {
				console.log(err);
				return res.send({status: 402});
			}
			console.log("User created: " + user.username);
			req.login(user, function(err) {
				if (err) { 
					return res.send({status: 401});
				}
				return res.send({status: 200});
			});
		});
	},
	auth_local: function (req, res) {
		passport.authenticate('local', function(err, user, info) {
			if (err || !user) return res.send({status: 401});
			req.login(user, function(err) {
				if (err) { return next(err); }
				return res.send({status: 200});
			});
		})(req, res);
	},
    
	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to UserController)
	*/
	_config: {}

  
};
