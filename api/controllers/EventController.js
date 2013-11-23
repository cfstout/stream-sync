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
  	Event.create({
        name: req.param('name'),
        host: req.user.username,
        audio: audio.id,
        time: time
      }).done(function(err, event) {
        if (!event) {
          err = "Event could not be created";
        }
        if (err) {
          console.log(err);
          return res.send(err, 500);
        }
        return res.view({event: event, audio: audio}, 'event/view');
      });
  },
  find: function (req, res) {
    var name = req.param('name');
    name = String(name).replace(/-/g, " ");
    Event.findOne({name: name}, (function (err, event) {
      if (!event) {
        err = 'No Event found with name: ' + name;
        return res.json(err, 500);
      }
      Audio.findOne(event.audio, (function (err, audio) {
        if (!audio) {
          err = 'No Event found with audio: ' + event.audio;
          return res.json(err, 500);
        }
        return res.view({event: event, audio: audio}, 'event/view');
      }));
    }));
  },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to EventController)
   */
  _config: {}

  
};
