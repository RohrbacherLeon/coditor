const express = require('express');
const app = express();
const server = require('http').createServer(app);
const router = express.Router();

app.set('views', __dirname + '/src/views');
app.set('view_engine', 'twig');

router.get('/home', (req, res) => {
    res.render('HomeView');
});

server.listen(8080, function(){
    console.log("Server running");
});