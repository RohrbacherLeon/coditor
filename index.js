const express = require('express');
const app = express();
const server = require('http').createServer(app);

//const router = express.Router();
//const body_parser = require('body-parser');

app.set('views', __dirname + '\\src\\views');
//app.set('assets', __dirname + '\\assets');
app.set('view engine', 'twig');


app.get('/home', (req, res) => {
    res.render('HomeView');
});

server.listen(8080, function(){
    console.log("Server running");
});