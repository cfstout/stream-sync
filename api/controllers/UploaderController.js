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

module.exports = {
    

   	upload: function(response, request){
   		var form = new formidable.IncomingForm();
   		form.parse(request, function(error, field, files){

   			console.log(files.upload.path);
   			fs.rename(files.upload.path, "/assets/audio/test.mp3", function(error){
   				if(error){
   					fs.unlink("");
   					fs.rename(files.upload.path, "/assets/audio/test.mp3");
   				}
   			});

   			response.end();
   		});
   	},
    
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UploaderController)
   */
  _config: {}

  
};
