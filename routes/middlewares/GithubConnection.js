const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;

const User = require("../../models/User");

passport.use(new GitHubStrategy({
    clientID: "9b023438a6ce2b64d9be",
    clientSecret: "23e8f7043619d39fe79c0f1cf4d5e6830512664f",
    callbackURL: "http://localhost:3000/auth/github/callback"
},
function (accessToken, refreshToken, profileGithub, done) {
    User.findOne({ "remote_id": profileGithub.id }, function (err, user) {
        if (err) {
            return done(err);
        }
        // If user already exist, use it
        if (user) {
            user.profile = {
                username: profileGithub.username,
                email: profileGithub._json.email
            };
            user.urlImage = profileGithub.photos[0].value;
            user.save();
            return done(null, user);
        } else {
            let newUser = new User();
            newUser.account = "github";
            newUser.remote_id = profileGithub.id;
            newUser.profile = {
              username: profileGithub.username,
              email: profileGithub._json.email
            };
            newUser.urlImage = profileGithub.photos[0].value;
            newUser.score = {
                total: 0,
                langs: {
                    js: 0,
                    php: 0
                }
            };
            newUser.save(function (err) {
                if (err) {
                    throw err;
                }
                return done(null, newUser);
            });
        }
    });
}));

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

module.exports = passport;