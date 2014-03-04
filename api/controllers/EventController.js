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

	/**
	*	Creates a new Event object
	*	@params:
	*		string name: the desired username
	* 		User creator: the creator of the event
	* 	@return:
	* 		string message: descriptive message regarding status
	* 		integer status: http response status
	*/
	create: function (req, res) {
		Event.create({
			name: req.param('name'),
			creator: 'test'
		}).done(function (err, event) {
			if (err) {
				console.log(err);
				return res.send({status: 401}, 401);
			}
			/* 
			*  Below are requirements for an Event:
			*  Specifically the playlist and memberlist
			*  attributes
			*/
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
						return res.send({status: 402}, 402);
					}
					event.memberList = memberList.id;

					/* 
					* Adds attributes and returns successful
					* object to the user 
					*/
					event.save(function(err) {
					    if (err) {
					    	console.log(err);
							return res.send({status: 403}, 403);
					    }
					    else {
					    	console.log("Event created: " + event.name);
							return res.send({event: event, status: 200}, 200);
					    }
					  });
				});
			});
			
		});
	},

	/**
	*	Returns events created by passed in user
	*	@params:
	* 		User creator: the creator of the event
	* 	@return:
	* 		Array of events: all events the user has created
	* 		integer status: http response status
	*/
	
	get_events_by_creator: function (req, res) {
		Event.find({
			creator: req.user.username
		}).done(function (err, event) {
			if (err) {
				console.log(err);
				return res.send({status: 401}, 401);
			}
			else {
				return res.send({events: event}, 200);
			}

			
		});
	},

	list: function(req, res){
		Event.find().done(function(err,events){
			if(err){
				return console.log(err);
			}	
			/*
			* If successsful logs the events found 
			* and sends them to the front end
			*/
			else{
				console.log("Events found:", events);
				return res.send({event: events, status: 200},200);
			}
		});
	},

	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to EventController)
	*/
	_config: {}


};
