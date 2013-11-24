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
    
  create: function(req, res) {
  	Playlist.create({
  		audio: new Array(),
      curTrack: 0
  	}).done(function(err, playlist) {
      if (!playlist) {
        err = "Playlist could not be created";
      }
  		if (err) {
			  console.log(err);
			  return res.send(err, 500);
		  }
  		Event.create({
        name: req.param('name'),
  			host: req.user.username,
  			playlist: playlist.id,
  		}).done(function(err, event) {
        if (!event) {
          err = "Event could not be created";
        }
        if (err) {
          console.log(err);
          return res.send(err, 500);
        }
        req.user.currentEvent = event.name;
        req.user.save(function(err){
          if(err){
            console.log(err);
          } else {
            console.log("Working");
          }
        });
        return res.view({event: event, playlist: playlist, user: req.user}, 'event/view');
  		});
  	});
  },
  get: function(req, res) {
      var name = req.param('name');
      name = String(name).replace(/-/g, " ");
      Event.findOne({name: name}, (function (err, event) {
        if (err || !event) {
          err = 'No Event found with name: ' + name;
          return res.json(err, 500);
        }
        Playlist.findOne(event.playlist, (function (err, playlist) {
          if (err || !playlist) {
            err = 'No Event found with playlist: ' + event.playlist;
            return res.json(err, 500);
          }
          return res.view({event: event, playlist: playlist, user: req.user}, 'event/view');
        }));
      }));
    },

  find: function (req, res) {
    var name = req.param('eventName');
    console.log(name);
    Event.find({name: {
      contains: name
        }}, (function (err, events) {
      if (err || !events) {
        err = 'No Event found with name: ' + name;
        return res.json(err, 500);
      }
      console.log(events);
      return res.view({events: events}, 'event/list');
    }));
  },

  verifyHost: function(req, res) {
    console.log(req.param('eventid'));
    Event.findOne(req.param('eventid'), function(err, event) {
      if (err || !event) return false;
      if (req.user.username == event.host) {
        return true;
      }
      return false;
    });
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to EventController)
   */
  _config: {}

  
};
