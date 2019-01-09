const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('../../models/User');

let url = "http://localhost:3000";

passport.use(new GoogleStrategy({
    clientID: "390419281548-9a2agfhgeses62tmouj64jlr5jidi2ug.apps.googleusercontent.com",
    clientSecret: "8e33V8Vyjwl7CrNJ4mqwnW7v",
    callbackURL: url+"/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
      User.findOne({'google.id':profile.id}, function(err, user){
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
          newUser.google.id = profile.id;
          newUser.google.email = profile.emails[0].value;
          newUser.google.first_name = profile.name.givenName;
          newUser.google.last_name = profile.name.familyName;
          newUser.urlImage = profile.photos[0].value;

          newUser.save(function(err){
            if(err)
              throw err;
            return done(null, newUser);
          });
        }
      });
  })
);

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

module.exports = passport;