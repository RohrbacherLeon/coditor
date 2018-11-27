const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController')

router.get('/', (req, res) => {
    res.render('HomeView');
});

router.get('/login', (req, res) =>{
    res.render('LoginView');
});


router.get('/register', UserController.register_get);

router.post('/register', UserController.register_post);

router.get('/forgot_password', (req, res) => {
    res.render('ForgotPasswordView');
});

module.exports = router;