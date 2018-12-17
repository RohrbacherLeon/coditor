const express = require('express');
const router = express.Router();

const {ensureAuthenticated} = require('./middlewares/Authenticated');

router.get('/', ensureAuthenticated, (req, res) =>{
    if(req.user.type == "student")
        res.render('ProfileView');
    else
        res.render('ProfileTeacherView');
});

module.exports = router;