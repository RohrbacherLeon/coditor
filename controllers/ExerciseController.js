const Exercise = require('../models/Exercise');
const Mocha = require('mocha');
const mocha = new Mocha({});
const fs = require('fs');
const Generator = require('../class/Generator');    

exports.getExoByLang = (req, res) => {
    Exercise.getAllValuesOf('language',function(err, languages){
        Exercise.getAllValuesOf('tags', (err, tags) => {
            let locale = req.params.lang;
            res.render('BrowsingView', {languages, locale, tags, menu:"exercises"});
        })
    })
}

/**
 * Function used to get the exercice.
 * @param {*} query 
 * @param {*} req 
 * @param {*} res 
 */
function showExercice(query, req, res){
    Exercise.getExo(query,function(err, exercise){
        let correctionText;
        let skeletonText;

        if(fs.existsSync(process.cwd() + `/corrections/${req.params.slug}.js`)){
            correctionText = fs.readFileSync(process.cwd() + `/corrections/${req.params.slug}.js`, "utf-8");
        }else{
            correctionText = null;
        }
        
        if(fs.existsSync(process.cwd() + `/skeletons/${req.params.slug}.js`)){
            skeletonText = fs.readFileSync(process.cwd() + `/skeletons/${req.params.slug}.js`, "utf-8");
        }else{
            skeletonText = null;
        }

        //If correction + skeleton
        if(correctionText != null && skeletonText != null){
            res.render('ExerciseView', {exercise, menu:"exercises", correctionText, skeletonText});
        }
        //If only correction
        if(correctionText != null && skeletonText == null){
            res.render('ExerciseView', {exercise, menu:"exercises", correctionText});
        }
        //If only skeleton
        if(correctionText == null && skeletonText != null){
            res.render('ExerciseView', {exercise, menu:"exercises", skeletonText});
        }
        //If no one
        if(correctionText == null && skeletonText == null){
            res.render('ExerciseView', {exercise, menu:"exercises"});
        }
    })
}

exports.getExercise = (req, res) => {
    let query = {
        slug :req.params.slug, 
        language : req.params.lang
    };

    showExercice(query, req, res);
}

exports.postExercise = (req, res) => {
    //temporaire car mocha garde en cache les fichiers chargés
    mocha = new Mocha({});

    //Fonction etudiant dans le textarea
    let fct = req.body.function;

    if(fct.trim() == ""){
        req.flash('error', 'Fait l\'exercice feignant');
        res.redirect(req.originalUrl)
    }else{
        //Lecture du fichier du prof pour vérifier la fonction de l'etudiant
        fs.readFile(process.cwd() + `/tests/${req.params.slug}.js`, "utf-8", function(err, data){
            //Génére un fichier nameFile de test (ajoute la fonction étudiante dans le fichier test du prof)
            let nameFile = Generator.generate(data, fct);
            if(nameFile){
                //si nameFile, c'est que le fichier bien généré
                //lancer mocha sur docker avec le namefile
                //exec(mocha ....../tmp/nameFile) sur le docker
                //ici c'est pour tester l'execution de mocha sans docker
                mocha.addFile(process.cwd() +'/tmp/' + nameFile);
                let results = {
                    fails   : [],
                    success : []
                }
    
                mocha.run(function(failures){
                    Generator.remove(nameFile);
                }).on('pass', function(test) {
                    results.success.push({
                        title : test.title,
                        speed : test.speed
                    })
                }).on('fail', function(test, err) {
                    results.fails.push({
                        title : test.title,
                        error : {
                            actual   : test.err.actual, 
                            expected : test.err.expected,
                            operator : test.err.operator
                        }
                    })
                }).on('end', function() {
                    let query = {
                        slug :req.params.slug, 
                        language : req.params.lang
                    };
                    showExercice(query, req, res);
                });
            }
        });
    }

}



 