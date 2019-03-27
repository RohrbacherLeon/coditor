const Exercise = require("../models/Exercise");
const fs = require("fs");
const Generator = require("../class/Generator");
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
        console.log(results);

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

            // si il n'y a aucune erreur d'analyse -> execute les tests unitaires
            // Lecture du fichier du prof pour vérifier la fonction de l'etudiant
            fs.readFile(process.cwd() + `/tests/${req.params.slug}.js`, "utf-8", function (err, data) {
                if (err) console.log(err);

                // Génére un fichier nameFile de test (ajoute la fonction étudiante dans le fichier test du prof)
                let nameFile = Generator.generate(data, fct, req.params.slug);
                if (nameFile) {
                    // execute le test dans un container docker
                    exec(`docker run --rm -v "$PWD":/usr/src/myapp -w /usr/src/myapp node:8 node nodescript.js ${nameFile}`, (error, stdout, stderr) => {
                        if (error) {
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

                            showExercice(query, req, res, titles);
                        }
                    });
                }
            });
        });
    }
};