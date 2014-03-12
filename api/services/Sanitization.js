var validator = require('validator');

exports.createSlug = function(string) {
    return string
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-');
};