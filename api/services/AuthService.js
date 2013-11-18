var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;


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

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  User.findOne({username: username}, function (err, user) {
    done(err, user);
  });
});