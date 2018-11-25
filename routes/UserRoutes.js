const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController')

router.get('/', (req, res) => {
    res.render('HomeView');
});

router.get('/login', (req, res) =>{
    res.render('LoginView');
});


router.get('/register', (req, res) =>{
    res.render('RegisterView');
});

router.post('/register', UserController.createUser);

router.get('/forgot_password', (req, res) => {
    res.render('ForgotPasswordView');
});

module.exports = router;