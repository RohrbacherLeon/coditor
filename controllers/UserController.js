const User = require('../models/User')
const {formFlash} = require('../class/Helper')

/**
 * When register is reached with post method
 */
exports.register_post = (req, res) => {

    req.sanitize("last_name").trim();
    req.sanitize("first_name").trim();
    req.sanitize("email").trim();

    req.checkBody('last_name', 'Le nom est requis.').notEmpty();
    req.checkBody('first_name', 'Le prénom est requis.').notEmpty();
    req.checkBody('email', 'L\'email est requis.').notEmpty();
    req.checkBody('email', 'L\'email n\'est pas valide.').isEmail();
	req.checkBody('password', 'Un mot de passe est requis.').notEmpty();
	req.checkBody('password', 'Le mot de passe doit contenir au minimum 8 caractères.').isLength({ min:8 });
	req.checkBody('confirm_password', 'Les mots de passes ne correspondent pas.').equals(req.body.password);
    
    if (req.validationErrors()){
        req.flash("error", req.validationErrors()[0].msg);
        formFlash(req)
        res.redirect('/register');
    } else {
        //test si l'email n'est deja pas utilise
        User.findOne({ email: { "$regex": "^" + req.body.email + "\\b", "$options": "i"} }, (err, user) => {
            //si email deja utilisé, on redirige vers la page register 
            if (user) {
                req.flash("error", "Cette adresse email est déjà utilisée.");
                formFlash(req)
                res.redirect('/register');
            }
            //si email pas utilisé, on créé l'utilisateur et on le redirige vers le login
			else {
				User.createUser(req.body,(err, user) => {
					if (err) throw err;
                });
                req.flash("success", "Votre compte à bien été créé !");
                res.redirect('/login');
            }
		});
    }

    
}

/**
 * When register is reached with get method
 */
exports.register_get = (req, res) => {
    res.render('RegisterView');
}

/**
 * When logout is reached with get method
 */
exports.logout = (req, res) => {
    req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/login');
}

/**
 * When login is reached with get method
 */
exports.login_get = (req, res) => {
    res.render('LoginView');
}

/**
 * When login is reached with post method
 */
exports.login_post = (req, res) => {
    res.redirect('/');
}