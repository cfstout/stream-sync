/**
 * SongController
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

var https = require('https');

module.exports = {
    
    search_youtube: function(req, res) {
        var query = req.param('query');

        var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet'+
        '&key=AIzaSyD6w_9FIvUHw-7WAvgMBiANyVVdeuvAUfg&order=relevance&maxResults=10'+
        '&type=video&videoEmbeddable=true&topic=/m/0kpv0g&q='+query;

        https.get(url, function(response) {
            var body = "";
            response.setEncoding('utf8');
            response.on('data', function(chunk) {
                body += chunk;
            });
            response.on('end', function() {
                res.send({list: JSON.parse(body), status: 200}, 200);
            });
        }).on('error', function(error) {
            console.log(error.message);
            res.send({error: error, status: 500}, 500);
        });

    },


    /**
    * Overrides for the settings in `config/controllers.js`
    * (specific to SongController)
    */
    _config: {}

  
};
