const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

const User = require('../../models/User');

passport.use(new GitHubStrategy({
    clientID: "9b023438a6ce2b64d9be",
    clientSecret: "23e8f7043619d39fe79c0f1cf4d5e6830512664f",
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {

    User.findOne({'github.id':profile.id}, function(err, user){
      //If error
      if(err)
        return done(err);
      //If user already exist, use it
      if(user)
        return done(null, user);
      //Else create one
      else
      {
        let newUser = new User();
        newUser.github.id = profile.id;
        newUser.github.username = profile.username;
        newUser.github.email = profile._json.email;
        newUser.github.urlImage = profile.photos[0].value;

        newUser.save(function(err){
          if(err)
            throw err;
          return done(null, newUser);
        });
      }
    });
  }
));

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

module.exports = passport;