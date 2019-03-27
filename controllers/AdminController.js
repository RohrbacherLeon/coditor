const User = require("../models/User");

exports.register_teacher = (req, res) => {
    User.findOneAndUpdate({ _id: req.params.id }, { $set: { pending: false } }, { upsert: false }, (err, user) => {
        if (err) {
            console.log(err);
            req.flash("Erreur de lors de la modification.");
        } else {
            req.flash("L'activation du compte a été réalisée avec succès.");
        }
        res.redirect("/admin/");
    });
};