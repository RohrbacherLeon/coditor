const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);


/***** VIEW CONFIGURATION *****/
app.set('views', __dirname + '/src/views');
app.set('view engine', 'twig');
/*****************************/

/***** MIDDLEWARES *****/
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/*******************/

/***** Routes *****/
app.use('/', require('./routes/UserRoutes'));
app.use('/profile', require('./routes/ProfileRoutes'));
/*******************/

/*
app.get('exercises_:language', (req, res) => {
    res.render('BrowsingView');
});
*/

server.listen(8080, function(){
    console.log("Server running on port 8080");
});