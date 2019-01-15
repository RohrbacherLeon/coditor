function ensureAuthenticated (req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
}   

function isTeacher(req, res, next){
	if(req.user.type == "teacher")
		return next()
	else
		res.redirect('/profile')
}

function isConnectedWithLocalAccount(req, res, next){
	if(req.user.account == "local")
		return next()
	else
		res.redirect('/profile')
}

module.exports = {
	ensureAuthenticated,
	isTeacher,
	isConnectedWithLocalAccount
};