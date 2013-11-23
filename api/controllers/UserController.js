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
		var arr = [];
		User.create({
			username: req.param('username'),
			password: req.param('password'),
			location: req.param('location'),
			friends: arr,
			currentEvent: "None",
			pastEvents: arr
		}).done(function(err, user) {
			if (err) {
				console.log(err);
				return res.send(err, 500);
			}
			console.log("User created: " + user.username);
			req.login(user, function(err) {
			  if (err) { return res.send(err, 500); }
			  return res.redirect('/u/' + req.user.username);
			});
		});
	},
	find: function (req, res) {
		var username = req.param('username');
		User.findOne({username: username}, (function (err, user){
			if (!user) {
				err = 'No User found with username: ' + username;
				return res.send(err, 500);
			};
			return res.view({user: user}, 'user/profile');
		}));
	},
	test: function (req, res) {
		res.send(req.user);
	},

	addFriend: function(req, res){
		console.log("Inside AddFriend");
		console.log(req.param('username'));
		console.log(req.param('friends'));
		var un = req.param('username');
		

		req.user.friends.push(un);
		req.user.save(function(err){
			if(err)
			{
				console.log(err);
			}
			else
			{
				console.log("Working");
			}
		});
		console.log(req.user.friends);
		return res.redirect('/u/'+un);
	},

	inviteToEvent: function(req, res){
		var username = req.param('username');

		User.update({username: username},{currentEvent: req.user.currentEvent}, function(err, users){
			if(err){
				return console.log(err);
			} else {
				console.log("Users update", users);
			}
		});

		return res.redirect('/u/'+username);
	},

	searchUsers: function(req, res){
		console.log("Searching for users");
		var username = req.param('username');
		User.find({
			  username: {
			    contains: username
			  }
			}, function(err, users){
				if(!users){
					return console.log("No users found");
				}
				else
				{
					console.log(users);
					return res.view({users: users}, 'user/list');
				}
			});
	},
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {}

  
};
