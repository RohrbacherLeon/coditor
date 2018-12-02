const express = require('express');
const router = express.Router();

router.get('/', ensureAuthenticated, (req, res) =>{
    res.render('ProfileView');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
}

module.exports = router;