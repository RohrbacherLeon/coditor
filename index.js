const config     = require('./config/config');
const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const server     = require('http').createServer(app);


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

server.listen(config.app.port, () => {
    console.log(`Server running on port ${config.app.port}`);
});