const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

const User = require('../../models/User');

passport.use(new GitHubStrategy({
  //A remplacer par un compte de l'app
    clientID: "ca205df9738e479d4121",
    clientSecret: "275fbe7802d5dff4287a1fb905520fff4262e4f9",
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
        // console.log(newUser);
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