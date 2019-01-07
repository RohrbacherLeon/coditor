const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController')

const passport = require('./middlewares/LocalConnection');

router.get('/', (req, res) => {
    res.render('HomeView');
});

router.get('/login', UserController.login_get);
router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true, failureFlash: 'Adresse email ou mot de passe incorrecte.', successFlash: 'Vous êtes maintenant connecté.' }));

router.get('/register', UserController.register_get);
router.post('/register', UserController.register_post);

router.get('/forgot_password', (req, res) => {
    res.render('ForgotPasswordView');
});

router.get('/logout', UserController.logout);

module.exports = router;