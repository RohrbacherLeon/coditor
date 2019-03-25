const User = require('../models/User');
const { formFlash } = require("../class/Helper");

exports.register_teacher = (req, res) => {
    req.sanitize("last_name").trim();
    req.sanitize("first_name").trim();
    req.sanitize("email").trim();

    req.checkBody("last_name", "Le nom est requis.").notEmpty();
    req.checkBody("first_name", "Le prénom est requis.").notEmpty();
    req.checkBody("email", "L'email est requis.").notEmpty();
    req.checkBody("email", "L'email n'est pas valide.").isEmail();
    req.checkBody("password", "Un mot de passe est requis.").notEmpty();
    req.checkBody("password", "Le mot de passe doit contenir au minimum 8 caractères.").isLength({ min: 2 });
    req.checkBody("confirm_password", "Les mots de passes ne correspondent pas.").equals(req.body.password);

    if (req.validationErrors()) {
        req.flash("error", req.validationErrors()[0].msg);
        formFlash(req);
        res.redirect("/manage/register");
    } else {
        // test si l"email n"est deja pas utilise
        User.findOne({ email: { "$regex": "^" + req.body.email + "\\b", "$options": "i" } }, (err, user) => {
            if (err) console.log(err);
            // si email deja utilisé, on redirige vers la page register
            if (user) {
                req.flash("error", "Cette adresse email est déjà utilisée.");
                formFlash(req);
                res.redirect("/manage/register");
            } else {
                // si email pas utilisé, on créé l'utilisateur et on le redirige vers le login
                req.body.type = "teacher";
                User.createUser(req.body, (err, user) => {
                    if (err) {
                        throw err;
                    } else {
                        req.flash("success", "Le compte enseignant a bien été créé !");
                        res.redirect("/manage/register");
                    }
                });
            }
        });
    }
}