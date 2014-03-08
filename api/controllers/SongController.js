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

var keys = {
    youtube: 'AIzaSyD6w_9FIvUHw-7WAvgMBiANyVVdeuvAUfg',
    soundcloud: '9be920a0587219cd0d35a351b4366c5d'
};

module.exports = {

    create_remote: function(req, res) {

        var source = req.param('source');
        var source_id = req.param('source_id');

        var url = '';

        if (source == 'youtube') {
            url = 'https://www.googleapis.com/youtube/v3/videos?part=contentDetails&key='+
            keys.youtube +'&id=' + source_id;
        } else if (source == 'soundcloud') {
            url = 'https://api.soundcloud.com/tracks/' +
            source_id + '.json?client_id=' + keys.soundcloud;
        } else {
            return res.send({error: 'invalid source', status: 500}, 500);
        }

        CrossDomain.get(url, res, function(data) {
            var duration = CrossDomain.processDuration(source, data);
            Song.create({
                artist: req.param('artist'),
                title: req.param('title'),
                source: source,
                source_id: source_id,
                duration: duration
            }).done(function(err, song) {
                if (err || (typeof song === 'undefined')) {
                    return res.send({
                        message: err,
                        status: 500
                    }, 500);
                }
                return res.send({song: song, status: 200}, 200);
            });
        });

    },
    
    search: function(req, res) {
        var query = req.param('query');
        var source = req.param('source');

        var url = '';

        if (source == 'youtube') {
            url = 'https://www.googleapis.com/youtube/v3/search?part=snippet'+
            '&key=' + keys.youtube + '&order=relevance&maxResults=5'+
            '&fields=items(id,snippet)&type=video&videoEmbeddable=true&topic=/m/0kpv0g&q=';
        } else if (source == 'soundcloud') {
            url = 'https://api.soundcloud.com/tracks.json'+
            '?client_id=' + keys.soundcloud + '&q=';
        } else {
            return res.send({error: 'invalid source', status: 500}, 500);
        }

        url = url + query;

        CrossDomain.get(url, res, function(data) {
            res.send({list: data, status: 200}, 200);
        });

    },


    /**
    * Overrides for the settings in `config/controllers.js`
    * (specific to SongController)
    */
    _config: {}

  
};
