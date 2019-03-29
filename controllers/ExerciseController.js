const Exercise = require("../models/Exercise");
const Set = require("../models/Set");
const User = require("../models/User");
const fs = require("fs");
const Generator = require("../class/Generator");
const { exec } = require("child_process");
const showdown = require("showdown");
const { analysePHPUnit, analyseJS } = require("../class/Analyzer");
var mongoose = require("mongoose");

exports.getExoByLang = (req, res) => {
    Exercise.getAllValuesOf("language", function (err, languages) {
        if (err) console.log(err);
        Exercise.getAllValuesOf("tags", (err, tags) => {
            if (err) console.log(err);
            let locale = req.params.lang;
            res.render("BrowsingView", { languages, locale, tags, menu: "exercises" });
        });
    });
};

/**
 * Function used to get the exercice.
 * @param {*} query
 * @param {*} req
 * @param {*} res
 */
function showExercice (query, req, res, results) {
    Exercise.getExo(query, function (err, exercise) {
        if (err) console.log(err);

        let correctionText;
        let skeletonText;

        // Test if file correction exist
        if (fs.existsSync(process.cwd() + `/corrections/${req.params.slug}.js`)) {
            correctionText = fs.readFileSync(process.cwd() + `/corrections/${req.params.slug}.js`, "utf-8");
        } else {
            correctionText = null;
        }

        // Test if file skeletons exist
        if (fs.existsSync(process.cwd() + `/skeletons/${req.params.slug}.js`)) {
            skeletonText = fs.readFileSync(process.cwd() + `/skeletons/${req.params.slug}.js`, "utf-8");
        } else {
            skeletonText = null;
        }

        let converter = new showdown.Converter();
        let markdown = converter.makeHtml(exercise.description);
        if (results) {
            results = results.map(result => result.toLowerCase());
        }

        res.render("ExerciseView", { exercise, results, menu: "exercises", correctionText, skeletonText, markdown, content: req.session.content, setParams: req.params });
    });
}

exports.getExercise = (req, res) => {
    if (req.session.content && req.session.content.slug !== req.params.slug) {
        req.session.content = {};
    }
    let query = {
        slug: req.params.slug,
        language: req.params.lang
    };
    showExercice(query, req, res);
};

exports.postExercise = (req, res) => {
    // Fonction etudiant dans le textarea
    let fct = req.body.function;

    if (fct.trim() === "") {
        req.flash("error", "Fait l'exercice feignant");
        res.redirect(req.originalUrl);
    } else {
        req.session.content = { fct, slug: req.params.slug };
        Exercise.findOne({ slug: req.params.slug }, (err, exo) => {
            if (err) console.log(err);

            // si il n'y a aucune erreur d'analyse -> execute les tests unitaires
            // Lecture du fichier du prof pour vérifier la fonction de l'etudiant
            fs.readFile(process.cwd() + `/tests/${exo.language}/${req.params.slug}.${exo.language}`, "utf-8", function (err, data) {
                if (err) console.log(err);

                let nameFile = "";
                let dockerCommande = "";

                switch (exo.language) {
                    case "js":
                        // // Génére un fichier nameFile de test (ajoute la fonction étudiante dans le fichier test du prof)
                        nameFile = Generator.generateJS(data, fct, req.params.slug);
                        dockerCommande = `docker run --rm -v $(pwd)/tmp:/app/tmp coditor-js node nodescript.js tmp/${nameFile}`;
                        executeDocker(req, res, nameFile, dockerCommande, exo.language);
                        break;
                    case "php":
                        nameFile = Generator.generatePHP(data, fct, req.params.slug);
                        dockerCommande = `docker run --rm -v $(pwd)/tmp:/app/tests/ coditor-php vendor/bin/phpunit --testdox tests/${nameFile}`;
                        executeDocker(req, res, nameFile, dockerCommande, exo.language);
                        break;
                    default:
                        break;
                }
            });
        });
    }
};

function executeDocker (req, res, nameFile, commande, lang) {
    exec(commande, (error, stdout, stderr) => {
        if (error) {
            fs.unlinkSync(process.cwd() + `/tmp/${nameFile}`);
            req.flash("error", "Une erreur est survenue.");
            res.redirect(req.originalUrl);
        } else {
            fs.unlinkSync(process.cwd() + `/tmp/${nameFile}`);
            let query = {
                slug: req.params.slug,
                language: req.params.lang
            };
            let analyse = {};
            switch (lang) {
                case "js":
                    analyse = analyseJS(stdout);
                    break;
                case "php":
                    analyse = analysePHPUnit(stdout);
                    break;
            }

            if (analyse.total === analyse.success.length) {
                updateScore(req, lang);
            }

            showExercice(query, req, res, analyse.success);
        }
    });
}

function updateScore (req, language) {
    req.user.score.total += 1;
    req.user.score.langs[language] = req.user.score.langs[language] >= 1 ? req.user.score.langs[language] + 1 : 1;

    User.findByIdAndUpdate(req.user._id, { $set: { score: req.user.score } }, function (err, result) {
        if (err) console.log(err);
    });
}

exports.deleteExercise = (req, res) => {
    Exercise.findById(req.params.id, (err, exo) => {
        if (err) res.sendStatus(404);
        if (exo.author === req.user.profile.email || req.user.type === "admin") {
            // si l'exo est dans une ou des séries on le supprime
            // si le set ne contenait que 2 exos on supprime le set
            exo.inSets.forEach(setId => {
                Set.findById(setId, (err, set) => {
                    if (err) res.sendStatus(404);
                    var index = set.exercises.indexOf(exo.id);
                    if (index > -1) {
                        set.exercises.splice(index, 1);
                    }
                    if (set.exercises.length < 2) {
                        Exercise.findById(set.exercises[0], (err, exo) => {
                            if (err) res.sendStatus(404);
                            var indexInSet = exo.inSets.indexOf(set.id);
                            if (indexInSet > -1) {
                                exo.inSets.splice(indexInSet, 1);
                            }
                            exo.save();
                            set.remove();
                        });
                    } else {
                        set.save();
                    }
                });
            });
            res.status(200);
            res.json(exo);
            exo.remove();
        } else {
            res.sendStatus(403);
        }
    });
};