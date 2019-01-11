const Exercise = require('../models/Exercise')
const formidable = require('formidable'),
    fs = require('fs'),
    path = require('path'),
    slugify = require('slugify')

exports.getProfile = (req, res) =>{
    if(req.user.type == "teacher"){
        Exercise.countDocuments({author:req.user.profile.email}, function (err, count) {
            res.render('ProfileView', {count, menu : "profile"});
        })
    }else{
        res.render('ProfileView', {count: "xx", menu : "profile"});
    }
}

exports.getCreateExercise = (req, res) =>{
    Exercise.getAllValuesOf('tags', (err, tags) => {
        res.render('CreateExerciseView', {tags});
    })
}

exports.postCreateExercise = (req, res) =>{
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        let slug = slugify(fields.title);
        
        Exercise.createExercise({
            title : fields.title,
            slug,
            tags : fields.tags.split(','),
            language : fields.language,
            author : req.user.profile.email,
            description : fields.description
        }, function (err, exo) {
            if(err) console.log(err);
        })

        //penser a verifer l'extension du fichier de test
        //trier les fichiers de test dans un dossier nommer par l'email de l'auteur ?
        
        //verification qu'il y est bien un fichier de test
        if(files.file.size > 0){
            let old_path = files.file.path,
                file_size = files.file.size,
                file_ext = files.file.name.split('.').pop(),
                index = old_path.lastIndexOf('/') + 1,
                file_name = old_path.substr(index),
                
                //Save test file to the folder tests
                new_path = path.join(process.cwd(), '/tests/', slug + '.' + file_ext);
            fs.readFile(old_path, function(err, data) {
                fs.writeFile(new_path, data, function(err) {
                    fs.unlink(old_path, function(err) {
                        //test if correction
                        if(files.file_correction.size > 0){
                            old_path = files.file_correction.path,
                                file_size = files.file_correction.size,
                                file_ext = files.file_correction.name.split('.').pop(),
                                index = old_path.lastIndexOf('/') + 1,
                                file_name = old_path.substr(index),

                                //Save correction file to the folder corrections
                                new_path = path.join(process.cwd(), '/corrections/', slug + '.' + file_ext);
                            fs.readFile(old_path, function(err, data) {
                                fs.writeFile(new_path, data, function(err) {
                                    fs.unlink(old_path, function(err) {
                                        if (err) {
                                            res.render('CreateExerciseView', {message : "Erreur lors de la création de l'exercice."});
                                        } else {
                                            res.render('CreateExerciseView', {message : "Exercice créé avec une correction."});
                                        }
                                    });
                                });
                            });
                        }
                        //If no correction, render
                        else{
                            if (err) {
                                res.render('CreateExerciseView', {message : "Erreur lors de la création de l'exercice."});
                            } else {
                                res.render('CreateExerciseView', {message : "Exercice créé."});
                            }
                        }
                    });
                });
            });
        }else{
            res.render('CreateExerciseView', {message : "Aucun fichier de test donné."});
        }
    });    
}

exports.getCreateExercisesSet = (req, res) =>{
    Exercise.getAllValuesOf('tags', (err, tags) => {
        res.render('CreateExercisesSetView', {tags});
    })
}