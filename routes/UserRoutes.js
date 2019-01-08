const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController')

const passport = require('./middlewares/LocalConnection');
const googlePassport = require('./middlewares/GoogleConnection');
const githubPassport = require('./middlewares/GithubConnection');

router.get('/', (req, res) => {
    res.render('HomeView');
});

router.get('/login', UserController.login_get);
router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true, failureFlash: 'Adresse email ou mot de passe incorrecte.', successFlash: 'Vous êtes maintenant connecté.' }));

router.get('/register', UserController.register_get);
router.post('/register', UserController.register_post);

//Google auth
router.get('/auth/google', googlePassport.authenticate('google', { scope : ['profile', 'email'] }));

//Callback after google has authenticated the user
router.get('/auth/google/callback', googlePassport.authenticate('google', {
        successRedirect : '/profile',
        failureRedirect : '/register'
}));

//Github auth
router.get('/auth/github', githubPassport.authenticate('github'));

//Callback after github has authenticated the user
router.get('/auth/github/callback', githubPassport.authenticate('github', {
    successRedirect : '/profile',
    failureRedirect : '/register'   
}));

router.get('/forgot_password', (req, res) => {
    res.render('ForgotPasswordView');
});

router.get('/logout', UserController.logout);

module.exports = router;