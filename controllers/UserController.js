const User = require('../models/User')

exports.createUser = (req, res) => {
    
    req.checkBody('first_name', 'Username is required').notEmpty();
    req.checkBody('last_name', 'Username is required').notEmpty();
    req.checkBody('email', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('confirm_password', 'Passwords do not match').equals(req.body.password);
    
    if (req.validationErrors())
        console.log('error')
	else {
        //test si l'email n'est deja pas utilise
        User.findOne({ email: { "$regex": "^" + req.body.email + "\\b", "$options": "i"} }, (err, user) => {
            //si email deja utilisé, on ridirige vers la page register 
            if (user) 
                res.render('RegisterView');
            //si email pas utilisé, on créé l'utilisateur et on le redirige vers le login
			else {
				User.createUser(req.body,(err, user) => {
					if (err) throw err;
                });

                res.redirect('/login');
            }
		});
    }

    
}