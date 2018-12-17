const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>{
    if(req.user.type == "student")
        res.render('ProfileView');
    else
        res.render('ProfileTeacherView');
});

module.exports = router;