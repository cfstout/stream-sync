/**
 * UploaderController
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

var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");
var UUIDGenerator = require('node-uuid');

module.exports = {
    

   	upload: function(req, res) {

   		console.log("BABY");


   		var form = new formidable.IncomingForm();

		    form.parse(req, function(err, fields, files) {
		    	console.log("Parse");
		      res.writeHead(200, {'content-type': 'text/plain'});
		      res.write('received upload:\n\n');
		      res.end(util.inspect({fields: fields, files: files}));
		    });

		return;
		
   		console.log(req.param('songName'));
   		console.log(req.param('artistName'));
   		Audio.create({
   			track: req.param('songName'),
   			arstist: req.param('artistName')
   		}).done(function(err, user){
   			if(err)
   			{
   				console.log(err);
   				return res.send(err, 500);
   			}
   			else
   			{
   				console.log("Audio created");
   			}
   		});
    },
    
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UploaderController)
   */
  _config: {}

  
};
