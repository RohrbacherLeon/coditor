const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('../../models/User');

let url = "http://localhost:3000";

passport.use(new GoogleStrategy({
    clientID: "627254041293-ftkjn2mqlshqnjrseo9hhamq9hbmdadm.apps.googleusercontent.com",
    clientSecret: "L5X9lTDqXo88mYnn3nT6EXBS",
    callbackURL: url+"/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
      // console.log("///////////////////////");
      // console.log(profile.photos[0].url); //profile contains all the personal data returned 
      // console.log("///////////////////////");
      
      User.findOne({'google.id':profile.id}, function(err, user){
        if(err)
          return done(err);
        if(user)
          return done(null, user);
        else
        {
          let newUser = new User();
          newUser.google.id = profile.id;
          newUser.google.email = profile.emails[0].value;
          newUser.google.first_name = profile.name.givenName;
          newUser.google.last_name = profile.name.familyName;
          newUser.google.urlImage = profile.photos[0].value;

          newUser.save(function(err){
            if(err)
              throw err;
            return done(null, newUser);
          });
          console.log(newUser);
        }
      });

      // console.log(googleAccount); //profile contains all the personal data returned 
      // done(null, googleAccount)
  })
);

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

module.exports = passport;