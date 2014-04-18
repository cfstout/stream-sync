'use strict';

var colors = ['113f8c', '01a4a4', '00a1cb', '61ae24', 'd0d102', '32742c', 'd70060', 'e54028', 'f18d05'];

exports.randomIcon = function () {
    var value, result;
    value = Math.random() * 87 + 128;
    result = Math.floor(value).toString(16);
    if (value < 16) {
        result = "0" + result;
    }
    result = "%ee%80%" + result;
    return decodeURIComponent(result);
};

exports.randomColor = function () {
    var index = Math.floor(Math.random() * colors.length);
    return "#" + colors[index];
};