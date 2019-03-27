const User = require("../models/User");
const Validator = require("../class/Validator");
const bcrypt = require("bcryptjs");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

exports.getSettings = (req, res) => {
    res.render("SettingsView");
};

exports.postSettingsGlobal = (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        if (err) console.log(err);

        let errors = Validator.check(fields, {
            "first_name": {
                rules: ["required"],
                messages: [
                    "Le prénom doit être remplis"
                ]
            },
            "last_name": {
                rules: ["required"],
                messages: [
                    "Le nom doit être remplis"
                ]
            },
            "email": {
                rules: ["email"],
                messages: [
                    "L'adresse email est invalide"
                ]
            }
        });

        if (errors.length > 0) {
            req.flash("error", errors[0].msg);
            res.redirect("/profile/settings");
        } else {
            let update = {};

            update["profile.first_name"] = fields.first_name;
            update["profile.last_name"] = fields.last_name;
            update["profile.email"] = fields.email;

            if (files.file.size > 0) {
                let oldPath = files.file.path;
                let fileExt = files.file.name.split(".").pop();
                // Save test file to the avatar folder
                let newPath = path.join(process.cwd(), "/public/images/avatars/", req.user.id + "." + fileExt);
                let savePath = `/images/avatars/${req.user.id}.${fileExt}`;

                fs.readFile(oldPath, function (err, data) {
                    if (err) console.log(err);

                    fs.writeFile(newPath, data, function (err) {
                        if (err) console.log(err);
                        fs.unlink(oldPath, function (err) {
                            if (err) console.log(err);
                            // test if correction
                            if (err) {
                                res.redirect("/profile/settings");
                            } else {
                                update["urlImage"] = savePath;
                                User.updateOne({ account: "local", "profile.email": req.user.profile.email }, { $set: update }, function (err, user) {
                                    if (err) console.log(err);

                                    res.redirect("/profile/settings");
                                });
                            }
                        });
                    });
                });
            } else {
                User.updateOne({ account: "local", "profile.email": req.user.profile.email }, { $set: update }, function (err, user) {
                    if (err) console.log(err);

                    res.redirect("/profile/settings");
                });
            }
        }
    });
};

exports.postSettingsPassword = (req, res) => {
    let errors = Validator.check(req.body, {
        "password": {
            rules: ["required"],
            messages: [
                "Mot de passe actuel erroné"
            ]
        },
        "new_password": {
            rules: ["required", "min:8"],
            messages: [
                "Vous devez choisir un nouveau mot de passe",
                "Le nouveau mot de passe doit contenir 8 caratères minimum"
            ]
        }
    });

    if (errors.length > 0) {
        req.flash("error", errors[0].msg);
        res.redirect("/profile/settings");
    } else {
        let actual = req.body.password;
        let newPassword = req.body.new_password;

        // verifie le mdp actuel
        bcrypt.compare(actual, req.user.profile.password).then(isSame => {
            if (isSame) {
                bcrypt.hash(newPassword, 10).then(hash => {
                    let update = {};
                    update["profile.password"] = hash;
                    User.updateOne({ account: "local", "profile.email": req.user.profile.email }, { $set: update }, function (err, user) {
                        if (err) console.log(err);
                        req.flash("success", "Votre mdp a été modifié");
                        res.redirect("/logout");
                    });
                });
            } else {
                req.flash("error", "Mot de passe actuel erroné");
                res.redirect("/profile/settings");
            }
        });
    }
};

exports.postSettingsDeleteAccount = (req, res) => {
    let errors = Validator.check(req.body, {
        "password": {
            rules: ["required"],
            messages: [
                "Mot de passe actuel erroné"
            ]
        }
    });

    if (errors.length > 0) {
        req.flash("error", errors[0].msg);
        res.redirect("/profile/settings");
    } else {
        let actual = req.body.password;

        // verifie le mdp actuel
        bcrypt.compare(actual, req.user.profile.password).then(isSame => {
            if (isSame) {
                User.deleteOne({ account: "local", "profile.email": req.user.profile.email }, function (err) {
                    if (err) return console.log(err);
                    // deleted at most one tank document
                    req.flash("success", "Le compte a été supprimé");
                    res.redirect("/login");
                });
            } else {
                req.flash("error", "Mot de passe actuel erroné");
                res.redirect("/profile/settings");
            }
        });
    }
};