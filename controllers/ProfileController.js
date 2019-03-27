const Exercise = require("../models/Exercise");
const Set = require("../models/Set");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");

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
    Exercise.getAllValuesOf("tags", (err, tags) => {
        if (err) console.log(err);
        res.render("CreateExerciseView", { tags });
    });
};

exports.postCreateExercise = (req, res) => {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        if (err) console.log(err);
        let title = fields.title.split('+').join(' ');
        let slug = slugify(title);

        Exercise.createExercise({
            title: title,
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

exports.postCreateExerciseSet = (req, res) => {
    Set.create({
        title: req.body.title,
        exercises: req.body.exercises_selected.split(","),
        author: req.user.profile.email
    }, function (err, set) {
        if (err) console.log(err);
    });

    req.flash("success", "Série d'exercices créée avec succès");
    res.redirect("/profile");
};

exports.getUpdateExercise = (req, res) => {
    let data = {
        slug: req.query.slug,
        language: req.query.lang,
    };
    //Get exercise data
    Exercise.getExo(data, function(err, exercise){
        if (err) console.log(err);
        //Get all already exists tags value and put it in the input
        let tagsValue = "";
        exercise.tags.forEach(function(val, key, arr) {
            if(key === arr.length-1){
                tagsValue += val;
            }else{
                tagsValue += val + ",";
            }
        });
        res.render("UpdateExerciseView", { exercise, tagsValue });
    });
};

exports.postUpdateExercise = (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) console.log(err);

        var newTitle = fields.title.split('+').join(' ');
        var lastTitle, lastSlug, lastExtFile;
        //Get last exo
        Exercise.getExo({slug: req.query.slug, language: req.query.lang}, function(err, exercise){
            if(err) console.log(err);
            lastTitle = exercise.title;
            lastSlug = exercise.slug;
            lastExtFile = exercise.language;

            //After, do all (update, files)
            let slug = slugify(newTitle);
            let update = {};
            update["title"] = newTitle;
            update["slug"] = slug;
            update["tags"] = fields.tags.split(",");
            console.log(fields.tags);
            update["description"] = fields.description;
            //Update exercise
            Exercise.updateOne({slug: req.query.slug, language: req.query.lang}, {$set: update}, function (err, exo) {
                if(err){
                    console.log(err);
                    res.render("UpdateExerciseView", { message: "Erreur lors de la création de l'exercice." });
                }else{
                    //Update all files
                    for (const file in files) {
                        let currentFile = files[file];
                        //If new file
                        if (currentFile.size > 0) {
                            let oldPath = currentFile.path;
                            let fileExt = currentFile.name.split(".").pop();
                            //Remove old file
                            let oldFile = path.join(process.cwd(),"/" + file.split("_").pop() + "/" + lastSlug + "." + lastExtFile);
                            fs.unlink(oldFile, function(err){
                                if(err) console.log(err);
                                //Create new file and save it to the folder
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
                            })
                        }
                        //if it's not a new file, update file name (if title has changed and no file is given)
                        else if(lastTitle != newTitle){
                            let oldFile = path.join(process.cwd(),"/" + file.split("_").pop() + "/" + lastSlug + "." + lastExtFile);
                            let newFile = path.join(process.cwd(),"/" + file.split("_").pop() + "/" + slug + "." + lastExtFile);
                            fs.rename(oldFile, newFile, function(){
                                if(err){
                                    console.log(err);
                                    res.render("CreateExerciseView", { message: "Erreur lors de la création de l'exercice." });
                                }
                            });
                        }
                    }
                    req.flash("success", "L'exercice a bien été modifié !");
                    res.redirect("/profile/");
                }
            });
        })
    });
};