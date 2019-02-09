const Exercise = require("../models/Exercise");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");

exports.getProfile = (req, res) => {
    if (req.user.type === "teacher") {
        Exercise.countDocuments({ author: req.user.profile.email }, function (err, count) {
            if (err) console.log(err);
            res.render("ProfileView", { count, menu: "profile" });
        });
    } else {
        res.render("ProfileView", { count: "xx", menu: "profile" });
    }
};

exports.getCreateExercise = (req, res) => {
    Exercise.getAllValuesOf("tags", (err, tags) => {
        if (err) console.log(err);
        res.render("CreateExerciseView", { tags });
    });
};

exports.postCreateExercise = (req, res) => {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        if (err) console.log(err);
        let slug = slugify(fields.title);

        Exercise.createExercise({
            title: fields.title,
            slug,
            tags: fields.tags.split(","),
            language: fields.language,
            author: req.user.profile.email,
            description: fields.description
        }, function (err, exo) {
            if (err) console.log(err);

            // Enregistement des fichiers sur le serveurs
            for (const file in files) {
                let currentFile = files[file];
                if (currentFile.size > 0) {
                    let oldPath = currentFile.path;
                    let fileExt = currentFile.name.split(".").pop();

                    // Save test file to the folder tests
                    let newPath = path.join(process.cwd(), "/" + file.split("_").pop() + "/", slug + "." + fileExt);
                    fs.readFile(oldPath, function (err, data) {
                        if (err) console.log(err);
                        fs.writeFile(newPath, data, function (err) {
                            if (err) console.log(err);
                            fs.unlink(oldPath, function (err) {
                                if (err) {
                                    res.render("CreateExerciseView", { message: "Erreur lors de la création de l'exercice." });
                                }
                            });
                        });
                    });
                }
            }

            Exercise.getAllValuesOf("tags", (err, tags) => {
                if (err) console.log(err);
                req.flash("success", "L'exercice a bien été ajouté !");
                res.redirect("/profile/create-exercise");
            });
        });
    });
};

exports.getCreateExercisesSet = (req, res) => {
    Exercise.getAllValuesOf("tags", (err, tags) => {
        if (err) console.log(err);

        res.render("CreateExercisesSetView", { tags });
    });
};
