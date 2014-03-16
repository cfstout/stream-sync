// Express middleware for authorizing users through passport

var passport    = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

module.exports = {
 express: {
    customMiddleware: function(app){
        app.use(allowCrossDomain);
        app.use(passport.initialize());
        app.use(passport.session());
    }
  }
};