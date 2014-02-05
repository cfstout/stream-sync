/**
 * EventController
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

	create: function (req, res) {
		Event.create({
			name: req.param('name'),
			creator: 'test'
		}).done(function (err, event) {
			if (err) {
				console.log(err);
				return res.send({status: 401});
			}

			PlayList.create({
				event: event.id,
				songs: []
			}).done(function(err, playList) {
				if (err) {
					return next(err);
				}
				event.playList = playList.id;

				MemberList.create({
					event: event.id,
					members: {},
					host: event.creator
				}).done(function(err, memberList) {
					if (err) {
						console.log(err);
						return res.send({status: 402});
					}
					event.memberList = memberList.id;

					event.save(function(err) {
					    if (err) {
					    	console.log(err);
							return res.send({status: 403});
					    }
					    else {
					    	console.log("Event created: " + event.name);
							return res.send({status: 200});
					    }
					  });
				});
			});
			
		});
	},


	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to EventController)
	*/
	_config: {}


};
