/**
 * ViewController
 *
 * @module      :: Controller
 * @description	:: Handles retrieving templates from assets
 * 
 */

module.exports = {

	/**
	*	Translates requests from routes into template objects.
	*	Retrieves them from the assets directory and serves it
	* 	to the user.
	*	@params:
	*		string folder: the folder of the asset in templates/
	* 		string view: the specific template file
	* 	@return:
	* 		text/html contents: the template contents
	*/

	index: function(req, res) {
		var path = "assets/angular/templates/" + 
			req.param("folder") + "/" + req.param("view") + ".html";
		require('fs').readFile(path, function (err, contents) {
			if (err) console.log(err);
			res.send(contents.toString());
		});
	},


	/**
	* Overrides for the settings in `config/controllers.js`
	* (specific to ViewController)
	*/
	_config: {}

  
};
