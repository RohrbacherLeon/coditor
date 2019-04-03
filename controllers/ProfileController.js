const Exercise = require("../models/Exercise");
const Set = require("../models/Set");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const Analyzer = require("../class/Analyzer");
const { decamelize } = require("../class/Helper");

exports.getProfile = (req, res) => {
    if (req.user.type === "teacher" || req.user.type === "admin") {
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
        params.languages = ["js", "php"];
        params.session = req.session.create;

        res.render("CreateExerciseView", params);
    });
};

exports.postCreateExercise = (req, res) => {
    var form = new formidable.IncomingForm();
    let languages = ["js", "php"];

    form.parse(req, function (err, fields, files) {
        if (err) console.log(err);
        let slug = slugify(fields.title, {
            replacement: "-",
            remove: /[*+~.()'"!:@]/g,
            lower: true
        });
        let errors = [];

        fields.arrayTags = fields.tags.split(",");
        req.session.create = fields;

        if (fields.tags === "") {
            errors.push("Aucun tags n'a été associé à cet exercice.");
        }

        if (!languages.includes(fields.language)) {
            errors.push("Le langage selectionné n'est pas valide.");
        }

        if (fields.description === "") {
            errors.push("Veuillez entrer une description.");
        }

        if (files["file_tests"].size === 0) {
            errors.push("Aucun fichier de test n'a été choisis.");
        }

        if (!languages.includes(files["file_tests"].name.split(".").pop()) || files["file_tests"].name.split(".").pop() !== fields.language) {
            errors.push("L'extension du fichier de test choisis ne correspond pas avec le langage de l'exercice selectionné.");
        }

        if (errors.length > 0) {
            req.flash("error", errors[0]);
            res.redirect(req.originalUrl);
        } else {
            req.session.create = {};
            Exercise.find({ slug, language: fields.language }).then((exo, err) => {
                if (err) console.log(err);

                if (exo.length > 0) {
                    req.flash("error", "Le titre de l'exercice est déjà utilisé.");
                    res.redirect(req.originalUrl);
                } else {
                    let testFile = files["file_tests"];
                    let testFileData = fs.readFileSync(testFile.path);

                    let titles = Analyzer.analyseTeacher(testFileData.toString("utf8"), fields.language);
                    if (Array.isArray(titles) && titles.length) {
                        titles = titles.map(title => decamelize(title));
                    }
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
                                let newPath = path.join(process.cwd(), "/" + file.split("_").pop() + "/" + fields.language + "/", slug + "." + fileExt);
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
                }
            });
        }
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
    let slug = slugify(req.body.title);
    if (req.user.profile.email) {
        Set.create({
            title: req.body.title,
            slug: slug,
            exercises: exSelected,
            author: req.user.profile.email
        }, function (err, set) {
            if (err) console.log(err);
            exSelected.forEach(exercise => {
                Exercise.findById({ _id: exercise }, function (err, data) {
                    if (err) console.log(err);
                    data.inSets.push(set.id);
                    data.save();
                });
            });
            req.flash("success", "Série d'exercices créée avec succès");
            res.redirect("/profile");
        });
    } else {
        req.flash("error", "Une erreur est survenue.");
        res.redirect(req.originalUrl);
    }
};

exports.getUpdateExercise = (req, res) => {
    let data = {
        slug: req.params.slug,
        language: req.params.lang
    };
    // Get exercise data
    Exercise.getExo(data, function (err, exercise) {
        if (err) console.log(err);
        // Get all already exists tags value and put it in the input
        let tagsValue = "";
        exercise.tags.forEach(function (val, key, arr) {
            if (key === arr.length - 1) {
                tagsValue += val;
            } else {
                tagsValue += val + ",";
            }
        });
        res.render("UpdateExerciseView", { exercise, tagsValue });
    });
};

exports.postUpdateExercise = (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) console.log(err);

        fields.title = fields.title.split("+").join(" ");
        let lastTitle, lastSlug, lastExtFile;
        // Get last exo
        Exercise.getExo({ slug: req.params.slug, language: req.params.lang }, function (err, exercise) {
            if (err) console.log(err);
            lastTitle = exercise.title;
            lastSlug = exercise.slug;
            lastExtFile = exercise.language;

            // After, do all (update, files)
            let slug = slugify(fields.title);
            let update = {
                title: fields.title,
                slug: slug,
                tags: fields.tags.split(","),
                description: fields.description
            };
            // Update exercise
            Exercise.updateOne({ slug: req.params.slug, language: req.params.lang }, { $set: update }, function (err, exo) {
                if (err) {
                    console.log(err);
                    res.render("UpdateExerciseView", { message: "Erreur lors de la création de l'exercice." });
                } else {
                    // Update all files
                    for (const file in files) {
                        let currentFile = files[file];
                        // If new file
                        if (currentFile.size > 0) {
                            // Remove old file
                            fs.unlink(path.join(process.cwd(), "/" + file.split("_").pop() + "/" + req.params.lang + "/" + lastSlug + "." + lastExtFile), function (err) {
                                if (err) console.log(err);
                                // Create new file and save it to the folder
                                fs.readFile(currentFile.path, function (err, data) {
                                    if (err) console.log(err);
                                    fs.writeFile(path.join(process.cwd(), "/" + file.split("_").pop() + "/" + req.params.lang + "/", slug + "." + currentFile.name.split(".").pop()), data, function (err) {
                                        if (err) console.log(err);
                                        fs.unlink(currentFile.path, function (err) {
                                            if (err) {
                                                res.render("CreateExerciseView", { message: "Erreur lors de la création de l'exercice." });
                                            }
                                        });
                                    });
                                });
                            });
                            // if it's not a new file, update file name (if title has changed and no file is given)
                        } else if (lastTitle !== fields.title) {
                            let oldFile = path.join(process.cwd(), "/" + file.split("_").pop() + "/" + req.params.lang + "/" + lastSlug + "." + lastExtFile);
                            let newFile = path.join(process.cwd(), "/" + file.split("_").pop() + "/" + req.params.lang + "/" + slug + "." + lastExtFile);
                            fs.rename(oldFile, newFile, function () {
                                if (err) {
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
        });
    });
};