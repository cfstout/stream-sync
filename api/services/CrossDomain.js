var https = require('https');

exports.get = function(url, res, done) {
    https.get(url, function(response) {
            var body = "";
            response.setEncoding('utf8');
            response.on('data', function(chunk) {
                body += chunk;
            });
            response.on('end', function() {
                try {
                    body = JSON.parse(body);
                } catch (exception) {
                    body = null;
                    res.send({error: exception, status: 500}, 500);
                }
                done(body);
            });
        }).on('error', function(error) {
            res.send({error: error, status: 500}, 500);
        });
};

exports.processDuration = function(source, object) {
    if (source == 'youtube') {
        var unformatted = object.items[0].contentDetails.duration;
        var parts = unformatted.split('M');
        var minutes = parseInt(parts[0].substring(2));
        var seconds = parseInt(parts[1]);
        return (minutes*60 + seconds)*1000;
    } else if (source == 'soundcloud') {
        return object.duration;
    } else {
        return null;
    }
};