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
	*		User creator: the creator of the event
	*	@return:
	*		string message: descriptive message regarding status
	*		integer status: http response status
	*/
	create: function (req, res) {
		Event.create({
			name: req.param('eventName'),
			datetime: req.param('datetime'),
			slug: Sanitization.createSlug(req.param('eventName')),
			creator: req.user.username,
			loc: req.user.loc 
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
			}).done(function(err, playlist) {
				if (err) {
					return next(err);
				}
				event.playlist = playlist.id;

				MemberList.create({
					event: event.id,
					members: {},
					host: event.creator
				}).done(function(err, memberlist) {
					if (err) {
						console.log(err);
						return res.send({status: 402}, 402);
					}
					event.memberlist = memberlist.id;

					/* 
					* Adds attributes and returns successful
					* object to the user 
					*/
					event.save(function(err) {
						if (err) {
							console.log(err);
							return res.send({status: 403}, 403);
						} else {
							console.log("Event created: " + event.creator + " loc: "+event.loc);
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
	*		User creator: the creator of the event
	*	@return:
	*		Array of events: all events the user has created
	*		integer status: http response status
	*/
	
	get_events_by_creator: function (req, res) {
		Event.find({
			creator: req.user.username
		}).done(function (err, event) {
			if (err) {
				console.log(err);
				return res.send({status: 401}, 401);
			}
			return res.send({events: event}, 200);
		});
	},

	join: function (req, res) {

		// find current event
		Event.findOne({
			slug: req.param('slug')
		}).done(function (err, event) {
			if (err || typeof event == 'undefined') {
				console.log(err);
				return res.send({error: error, status: 500}, 500);
			}

			// save event as current event
			req.user.event = event.id;
			req.user.save(function(err) {
				if (err) {
					console.log(err);
					return res.send({error: err, status: 500}, 500);
				}
			});

			// find and populate memberlists and playlists
			MemberList.findOne(event.memberlist).done(function(err, memberlist) {
				if (err || typeof memberlist == 'undefined') {
					console.log(err);
					return res.send({error: err, status: 500}, 500);
				} 
				// add user to memberlist
				memberlist.members[req.user.username] = req.user;
				memberlist.save(function(err) {
					if (err) {
						console.log(err);
						return res.send({error: err, status: 500}, 500);
					} 
					// publish added member to listeners
					MemberList.publishUpdate(memberlist.id, {
						meta: 'user_added',
						member: req.user,
						members: memberlist.members
					});
					event.memberlist = memberlist;

					if (event.memberlist.host == req.user.username) {
						event.isHost = true;
					}

					// get playlist
					PlayList.findOne(event.playlist).done(function(err, playlist) {
						if (err  || typeof playlist == 'undefined') {
							console.log(err);
							return res.send({error: err, status: 500}, 500);
						}
						event.playlist = playlist;

						// return event if successful
						return res.send({event: event}, 200);
					});
				});
			});
		});
	},

	subscribe: function(req, res) {
		// unsubscribe user from all previous events
		PlayList.unsubscribe(req.socket);
		MemberList.unsubscribe(req.socket);

		Event.findOne({slug: req.param('slug')}).done(function(err,event) {
			if (err || typeof event == 'undefined') {
				return res.send({error: err, status: 500}, 500);
			}
			// subscribe the user to the memberlist
			MemberList.subscribe(req.socket, {id: event.memberlist});
			// subscribe the user to the playlist
			PlayList.subscribe(req.socket, {id: event.playlist});

			return res.send({status: 200}, 200);
		});
	},

	list: function(req, res){
		var search_func;
		var query = req.param('query');
		var params = {
			or: [
				{ name: { contains: query } },
				{ creator: { contains: query } },
				{ loc: { contains: query } },
			]
		};
		var searchLim = 3;
		if(typeof(query) === 'undefined'){
			Event.find().sort('createdAt DESC').limit(searchLim).done(function(err, events){
				if(err){
					return console.log(err);
				}
				return res.send({events: events, status: 200}, 200);
			})
		}
		else{
			Event.find(params).sort('createdAt DESC').limit(searchLim).done(function(err,events){
				if (err) {
					return console.log(err);
				}
				console.log(events);
				console.log(params);
				/*
				* If successsful logs the events found 
				* and sends them to the front end
				*/

				return res.send({events: events, status: 200}, 200);
			});
		}
	},

	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to EventController)
	*/
	_config: {}


};
