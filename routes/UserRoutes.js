const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController')

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

router.get('/', (req, res) => {
    res.render('HomeView');
});

router.get('/login', UserController.login_get);


router.get('/register', UserController.register_get);

router.post('/register', UserController.register_post);

router.get('/forgot_password', (req, res) => {
    res.render('ForgotPasswordView');
});

passport.use(new LocalStrategy({usernameField: 'email'},
	function (username, password, done) {
		User.getUserByEmail(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	})
);

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }),
	(req, res) => { res.redirect('/'); }
);

router.get('/logout', UserController.logout);

module.exports = router;