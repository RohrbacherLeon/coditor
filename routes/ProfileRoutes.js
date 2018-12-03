const express = require('express');
const router = express.Router();

const {ensureAuthenticated} = require('./middlewares/Authenticated');

router.get('/', ensureAuthenticated, (req, res) =>{
    res.render('ProfileView');
});

module.exports = router;