// Load Passport dependencies
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

/**
* Local Strategy Definition
* Authenticates a user using credentials found on local servers
* Compares a requested password with stored password
*/
passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('Strategy used');
    User.findOne({ username: username }, function (err, user) {
      if (err) return done(err); 
      if (!user) {
        console.log('Strat Not User');
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        console.log('Strat Not Password');
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log('Worked');
      return done(null, user);
    });
  }
));

// Serializes user in the passport session
passport.serializeUser(function(user, done) {
  done(null, user.username);
});

// Deserializes user from session for passport authentication
passport.deserializeUser(function(username, done) {
  User.findOne({username: username}, function (err, user) {
    done(err, user);
  });
});