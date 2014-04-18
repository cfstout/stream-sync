'use strict';

var tumblr = require('tumblr');

var oauth = {
    consumer_key: 'mREeGOR9l03oL6KXtI7bj4k8540qf5GcBZMBcnxzfmZB0H603E',
    consumer_secret: 'kvxMcO9pPhYb1UrnHwWlbMs6AszIkGD8VjX2SaaidbvrLgAqtk',
    token: 'LC53f6RCOlBdCAbkNThGZnK7t4J2M8RNPNUGcjV2p56mJKN1K1',
    token_secret: 'gNuIkIqTHygtuZcsAZrosWA6ceU42m8ppbOLbnRusAgh1QFUjR'
};

var blog = new tumblr.Blog('unsplash.tumblr.com', oauth);
var num_posts = 304;

// blog.info(function (err, info) {
//     if (err) {
//         return console.log(err);
//     }
//     num_posts = info.posts;
// });

exports.getRandomPhoto = function (cb) {
    blog.photo({
        limit: 2,
        offset: Math.floor(Math.random() * num_posts)
    }, function (err, data) {
        var photos = data.posts[0].photos[0].alt_sizes;
        cb(err, photos);
    });
};