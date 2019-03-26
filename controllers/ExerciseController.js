const Exercise = require("../models/Exercise");
const fs = require("fs");
const Generator = require("../class/Generator");
const Analyzer = require("../class/Analyzer");
const { exec } = require("child_process");
const showdown = require("showdown");

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

        res.render("ExerciseView", { exercise, results, menu: "exercises", correctionText, skeletonText, markdown, content: req.session.content });
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

            let analyzeError = [];

            let analyzeStudent = Analyzer.analyse(fct);

            // si l'exercice n'attend pas de variable mais que l'étudiant en met une
            if (exo.awaited.variables === null && Object.entries(analyzeStudent.variables).length > 0) {
                analyzeError.push("Variables non attendues");
            }

            // si l'exercice attend une fonction
            if (exo.awaited.functions.length > 0) {
                if (analyzeStudent.functions.length === 0) {
                    analyzeError.push("Aucun nom de fonction trouvée");
                } else {
                    let errors = Analyzer.functionHasGoodName(analyzeStudent, exo.awaited);
                    if (errors.length > 0) {
                        analyzeError.push("Le nom de la fonction n'est pas bon");
                    }
                }
            }

            // si l'exercice attend une variable
            if (exo.awaited.variables !== null) {
                if (analyzeStudent.variables == null) {
                        analyzeError.push("Aucun nom de variable trouvée");
                } else {
                    let errors = Analyzer.variablesHasGoodName(analyzeStudent, exo.awaited);
                    if (errors.length > 0) {
                        analyzeError.push("Le nom de la variable n'est pas bon");
                    }
                }
            }

            // si il n'y a aucune erreur d'analyse -> execute les tests unitaires
            if (analyzeError.length === 0) {
                // Lecture du fichier du prof pour vérifier la fonction de l'etudiant
                fs.readFile(process.cwd() + `/tests/${req.params.slug}.js`, "utf-8", function (err, data) {
                    if (err) console.log(err);

                    // Génére un fichier nameFile de test (ajoute la fonction étudiante dans le fichier test du prof)
                    let nameFile = Generator.generate(data, fct, req.params.slug);
                    if (nameFile) {
                        // execute le test dans un container docker
                        exec(`docker run --rm -v "$PWD":/usr/src/myapp -w /usr/src/myapp node:8 node nodescript.js ${nameFile}`, (error, stdout, stderr) => {
                            if (error) {
                                console.error(`exec error: ${error}`);
                                return;
                            }
                            fs.unlinkSync(process.cwd() + `/tmp/${nameFile}`);
                            let query = {
                                slug: req.params.slug,
                                language: req.params.lang
                            };

                            console.log(JSON.parse(stdout).passes);

                            let titles = [];
                            JSON.parse(stdout).passes.forEach(passe => {
                                titles.push(passe.title);
                            });

                            showExercice(query, req, res, titles);
                        });
                    }
                });
            } else {
                req.flash("error", analyzeError[0]);
                res.redirect(req.originalUrl);
            }
        });
    }
};
