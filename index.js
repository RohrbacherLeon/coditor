const express = require('express');
const app = express();
const server = require('http').createServer(app);

//const router = express.Router();
//const body_parser = require('body-parser');

app.set('views', __dirname + '/src/views');
app.use(express.static(__dirname + '/assets'));
app.set('view engine', 'twig');

app.get('/', (req, res) => {
    res.render('HomeView');
});
app.get('/login', (req, res) =>{
    res.render('LoginView');
});
app.get('register', (req, res) =>{
    res.render('RegisterView');
});
app.get('forgot_password', (req, res) => {
    res.render('ForgotPasswordView');
});
/*
app.get('exercises_:language', (req, res) => {
    res.render('BrowsingView');
});
*/

server.listen(8080, function(){
    console.log("Server running");
});