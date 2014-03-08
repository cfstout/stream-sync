var validator = require('validator');

var lowerAlpha = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',' '];

exports.createSlug = function(string) {
    var result = string.toLowerCase();
    result = validator.whitelist(string, lowerAlpha);
    result = result.replace(' ', '-');
    return result;
};