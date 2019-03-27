const Exercise = require("../models/Exercise");
const Set = require("../models/Set");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const Analyzer = require("../class/Analyzer");

exports.getProfile = (req, res) => {
    if (req.user.type === "teacher") {
        Exercise.ByAuthor(req.user.profile.email, function (err, exos) {
            if (err) console.log(err);
            Set.ByAuthor(req.user.profile.email, function (err, series) {
                if (err) console.log(err);
                res.render("ProfileView", { exos, series, menu: "profile" });
            });
        });
    } else {
        res.render("ProfileView", { count: "xx", menu: "profile" });
    }
};

exports.getCreateExercise = (req, res) => {
    let params = {};
    Exercise.getAllValuesOf("tags", (err, tags) => {
        if (err) console.log(err);
        params.tags = tags;
        Exercise.getAllValuesOf("language", (err, langs) => {
            if (err) console.log(err);
            params.languages = langs;
            res.render("CreateExerciseView", params);
        });
    });
};

exports.postCreateExercise = (req, res) => {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        if (err) console.log(err);
        let slug = slugify(fields.title);

        let testFile = files["file_tests"];
        let testFileData = fs.readFileSync(testFile.path);
        let titles = Analyzer.analyseTeacher(testFileData.toString("utf8"));

        Exercise.createExercise({
            title: fields.title,
            slug,
            tags: fields.tags.split(","),
            language: fields.language,
            author: req.user.profile.email,
            description: fields.description,
            awaited: { titles }
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

exports.postCreateExercisesSet = (req, res) => {
    let exSelected = req.body.exercises_selected.split(",");
    if (req.user.profile.email) {
        Set.create({
            title: req.body.title,
            exercises: exSelected,
            author: req.user.profile.email
        }, function (err, set) {
            if (err) console.log(err);
            req.flash("success", "Série d'exercices créée avec succès");
            res.redirect("/profile");
        });
    } else {
        req.flash("error", "Une erreur est survenue.");
        res.redirect(req.originalUrl);
    }
};