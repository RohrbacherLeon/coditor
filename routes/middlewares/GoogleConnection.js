const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('../../models/User');

let url = "http://localhost:3000";

passport.use(new GoogleStrategy({
    clientID: "390419281548-9a2agfhgeses62tmouj64jlr5jidi2ug.apps.googleusercontent.com",
    clientSecret: "8e33V8Vyjwl7CrNJ4mqwnW7v",
    callbackURL: url+"/auth/google/callback"
  },
  function(token, tokenSecret, profileGoogle, done) {
    
      User.findOne({'google.id':profileGoogle.id}, function(err, user){
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
          newUser.account = 'google';
          newUser.remote_id = profileGoogle.id,
          newUser.profile = {
            email : profileGoogle.emails[0].value,
            first_name : profileGoogle.name.givenName,
            last_name : profileGoogle.name.familyName,
          }
          newUser.urlImage = profileGoogle.photos[0].value,

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