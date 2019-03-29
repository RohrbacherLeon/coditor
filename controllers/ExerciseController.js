const Exercise = require("../models/Exercise");
const Set = require("../models/Set");

const fs = require("fs");
const Generator = require("../class/Generator");
const { exec } = require("child_process");
const showdown = require("showdown");
const { analysePHPUnit } = require("../class/Analyzer");

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

                switch (exo.language) {
                    case "js":
                        // // Génére un fichier nameFile de test (ajoute la fonction étudiante dans le fichier test du prof)
                        let nameFile = Generator.generateJS(data, fct, req.params.slug);
                        if (nameFile) {
                            // execute le test dans un container docker
                            exec(`docker run --rm -v $(pwd)/tmp:/app/tmp coditor-js node nodescript.js tmp/${nameFile}`, (error, stdout, stderr) => {
                                if (error) {
                                    console.log(error);

                                    req.flash("error", "Une erreur est survenue.");
                                    res.redirect(req.originalUrl);
                                } else {
                                    fs.unlinkSync(process.cwd() + `/tmp/${nameFile}`);
                                    let query = {
                                        slug: req.params.slug,
                                        language: req.params.lang
                                    };

                                    let titles = [];
                                    JSON.parse(stdout).passes.forEach(passe => {
                                        titles.push(passe.title);
                                    });
                                    /*
                                    if (JSON.parse(stdout).stats.tests <= titles.length) {
                                        req.user.score.total += 1;
                                        req.user.score.lang.js += 1;
                                    }
                                    */
                                    showExercice(query, req, res, titles);
                                }
                            });
                        }
                        break;
                    case "php":
                        let name = Generator.generatePHP(data, fct, req.params.slug);
                        if (name) {
                            // execute le test dans un container docker
                            exec(`docker run --rm -v $(pwd)/tmp:/app/tests/ coditor-php vendor/bin/phpunit --testdox tests/${name}`, (error, stdout, stderr) => {
                                if (error) console.log(error);

                                // retourne les tests passés avec succès
                                let success = analysePHPUnit(stdout);

                                fs.unlinkSync(process.cwd() + `/tmp/${name}`);
                                let query = {
                                    slug: req.params.slug,
                                    language: req.params.lang
                                };
                                showExercice(query, req, res, success);
                            });
                        }
                        break;
                    default:
                        break;
                }
            });
        });
    }
};

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