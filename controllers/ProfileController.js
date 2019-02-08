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

/**
 * Function used to save a file (Test, Correction and Skeleton). Return "ok" if no error.
 * @param {*} file the file
 * @param {*} repertory repertory where the file are save.
 * @param {*} slug
 * @param {*} res
 */
function saveFile (file, repertory, slug, res) {
    let oldPath = file.path;
    let fileExt = file.name.split(".").pop();

    // Save test file to the folder tests
    let newPath = path.join(process.cwd(), "/" + repertory + "/", slug + "." + fileExt);
    fs.readFile(oldPath, function (err, data) {
        if (err) console.log(err);
        fs.writeFile(newPath, data, function (err) {
            if (err) console.log(err);
            fs.unlink(oldPath, function (err) {
                if (err) {
                    res.render("CreateExerciseView", { message: "Erreur lors de la création de l'exercice." });
                } else {
                    return "ok";
                }
            });
        });
    });
}

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
        });

        // penser a verifer l'extension du fichier de test
        // trier les fichiers de test dans un dossier nommer par l'email de l'auteur ?

        // if a file "Test" exist
        let testFile;
        if (files.file.size > 0) {
            testFile = saveFile(files.file, "tests", slug, res);
        } else {
            res.render("CreateExerciseView", { message: "Aucun fichier de test donné." });
        }

        // test if correction exist, create file
        let correctionFile;
        if (files.file_correction.size > 0) {
            correctionFile = saveFile(files.file_correction, "corrections", slug, res);
        }

        // test if skeleton exist, create file
        let skeletonFile;
        if (files.file_skeleton.size > 0) {
            skeletonFile = saveFile(files.file_skeleton, "skeletons", slug, res);
        }

        // Return message
        let messageCreation = "";
        if (testFile != null) {
            messageCreation = "Exercice créé";
        }
        if (correctionFile != null) {
            messageCreation += ", avec correction";
        }
        if (skeletonFile != null) {
            messageCreation += ", avec squelette";
        }

        Exercise.getAllValuesOf("tags", (err, tags) => {
            if (err) console.log(err);
            res.render("CreateExerciseView", { tags });
        });
    });
};

exports.getCreateExercisesSet = (req, res) => {
    Exercise.getAllValuesOf("tags", (err, tags) => {
        if (err) console.log(err);

        res.render("CreateExercisesSetView", { tags });
    });
};
