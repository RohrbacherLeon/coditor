const User = require("../models/User");
const { formFlash } = require("../class/Helper");

function filterPost (req) {
    req.sanitize("last_name").trim();
    req.sanitize("first_name").trim();
    req.sanitize("email").trim();

    req.checkBody("last_name", "Le nom est requis.").notEmpty();
    req.checkBody("first_name", "Le prénom est requis.").notEmpty();
    req.checkBody("email", "L'email est requis.").notEmpty();
    req.checkBody("email", "L'email n'est pas valide.").isEmail();
    req.checkBody("password", "Un mot de passe est requis.").notEmpty();
    req.checkBody("password", "Le mot de passe doit contenir au minimum 8 caractères.").isLength({ min: 8 });
    req.checkBody("confirm_password", "Les mots de passes ne correspondent pas.").equals(req.body.password);
    return req;
}

/**
 * When register is reached with post method
 */
exports.register_post = (req, res) => {
    req = filterPost(req);

    if (req.validationErrors()) {
        req.flash("error", req.validationErrors()[0].msg);
        formFlash(req);
        res.redirect("/register");
    } else {
        // test si l"email n"est deja pas utilise
        User.findOne({ "profile.email": req.body.email }, (err, user) => {
            if (err) console.log(err);
            // si email deja utilisé, on redirige vers la page register
            if (user) {
                req.flash("error", "Cette adresse email est déjà utilisée.");
                formFlash(req);
                res.redirect("/register");
            } else {
                // si email pas utilisé, on créé l'utilisateur et on le redirige vers le login
                User.createUser(req.body, (err, user) => {
                    if (err) throw err;
                    req.flash("success", "Votre compte a bien été créé !");
                    res.redirect("/login");
                });
            }
        });
    }
};

exports.register_teacher = (req, res) => {
    req = filterPost(req);

    if (req.validationErrors()) {
        req.flash("error", req.validationErrors()[0].msg);
        formFlash(req);
        res.redirect("/register_teacher");
    } else {
        // test si l"email n"est deja pas utilise
        User.findOne({ "profile.email": req.body.email }, (err, user) => {
            if (err) console.log(err);
            // si email deja utilisé, on redirige vers la page register
            if (user) {
                req.flash("error", "Cette adresse email est déjà utilisée.");
                formFlash(req);
                res.redirect("/register_teacher");
            } else {
                // on indique qu'il s'agit d'un enseignant
                req.body.type = "teacher";
                req.body.pending = true;
                req.body.firsttime = true;
                // si email pas utilisé, on créé l'utilisateur et on le redirige vers le login
                User.createUser(req.body, (err, user) => {
                    if (err) {
                        throw err;
                    } else {
                        req.flash("success", "Votre demande a bien été effectuée ! Elle sera prise en charge par un administrateur dans les plus brefs délais.");
                        res.redirect("/register_teacher");
                    }
                });
            }
        });
    }
};

/**
 * When logout is reached with get method
 */
exports.logout = (req, res) => {
    req.logout();
    req.flash("success_msg", "Vous avez été deconnecté.");
    res.redirect("/login");
};