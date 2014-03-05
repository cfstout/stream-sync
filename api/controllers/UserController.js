/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: Handles user data and actions
 */

var passport = require('passport');

module.exports = {

	/**
	* /////////////////////\\\\\\\\\\\\\\\\\\\\\\\
	* |||||||| AUTHENTICATION FUNCTIONS ||||||||||
	* \\\\\\\\\\\\\\\\\\\\\///////////////////////
	*/

	/**
	*	Creates a new user object and logs them in
	*	@params:
	*		string username: the desired username
	* 		string password: the desired password
	* 	@return:
	* 		string message: descriptive message regarding status
	* 		integer status: http response status
	*/

	signup: function (req, res) {
		User.create({
			username: req.param('username'),
			password: req.param('password')
		}).done(function(err, user) {
			if (err || (typeof user === 'undefined')) {
				return res.send({
					message: err,
					status: 500
				}, 500);
			}
			console.log("User created: " + user.username);
			req.login(user, function(err) {
				if (err) {
					return res.send({
						message: err,
						status: 401
					}, 401);
				}
				return res.send({
					message: "User: " + user.username + " created",
					status: 200
				}, 200);
			});
		});
	},

	/**
	*	Logs a user in and returns it if successful
	*	@params:
	*		object request: holds session data
	* 	@return:
	*		User user: returns user if successful or null if not
	* 		string message: descriptive message regarding status
	* 		integer status: http response status
	*/

	auth_local: function (req, res) {
		console.log("User Authenticated");
		passport.authenticate('local', function(err, user, info) {
			if (err || !user) return res.send({
				message: err + " User could not be authenticated",
				status: 401
			}, 401);
			return res.send({
				user: user,
				message: "User authenticated successfully!",
				status: 200,
			}, 200);
		})(req, res);
	},

	/**
	*	Logs a user out of the system
	*	@params:
	*		object request: holds session data
	* 	@return:
	* 		integer status: http response status
	*/

	logout: function(req, res) {
		req.logout();
		return res.send({status: 200}, 200);
	},

/**
	*	Returns the user that is currently logged into the system
	*	@params:
	*		object request: holds session data
	* 	@return:
	* 		object username: current logged in user
	*/

	logged_in: function(req, res) {
		return res.send({user: req.user}, 200);
	},


    
	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to UserController)
	*/
	_config: {}

  
};
