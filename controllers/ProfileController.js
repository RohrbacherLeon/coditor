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
        let old_path_test;
        if(files.file.size > 0){
                old_path_test = files.file.path;

                let file_size_test = files.file.size,
                file_ext_test = files.file.name.split('.').pop(),
                index_test = old_path_test.lastIndexOf('/') + 1,
                file_name_test = old_path_test.substr(index_test),
                
                //Save test file to the folder tests
                new_path_test = path.join(process.cwd(), '/tests/', slug + '.' + file_ext_test);
            fs.readFile(old_path_test, function(err, data) {
                fs.writeFile(new_path_test, data, function(err) {
                    fs.unlink(old_path_test, function(err) {
                        if(err){
                            res.render('CreateExerciseView', {message : "Erreur lors de la création de l'exercice."});
                        }
                    });
                });
            });
        }else{
            res.render('CreateExerciseView', {message : "Aucun fichier de test donné."});
        }

        //test if correction exist
        let old_path_correction;
        if(files.file_correction.size > 0){
                old_path_correction = files.file_correction.path;
                let file_size_correction = files.file_correction.size,
                file_ext_correction = files.file_correction.name.split('.').pop(),
                index_correction = old_path_correction.lastIndexOf('/') + 1,
                file_name_correction = old_path_correction.substr(index_correction),

                //Save correction file to the folder corrections
                new_path_correction = path.join(process.cwd(), '/corrections/', slug + '.' + file_ext_correction);
            fs.readFile(old_path_correction, function(err, data) {
                fs.writeFile(new_path_correction, data, function(err) {
                    fs.unlink(old_path_correction, function(err) {
                        if(err){
                            res.render('CreateExerciseView', {message : "Erreur lors de la création de l'exercice."});
                        }
                    });
                });
            });
        }
        //test if skeleton exist
        let old_path_skeleton;
        if(files.file_skeleton.size > 0){
                old_path_skeleton = files.file_skeleton.path;
                let file_size_skeleton = files.file_skeleton.size,
                file_ext_skeleton = files.file_skeleton.name.split('.').pop(),
                index_skeleton = old_path_skeleton.lastIndexOf('/') + 1,
                file_name_skeleton = old_path_skeleton.substr(index_skeleton),

                //Save correction file to the folder skeletons
                new_path_skeleton = path.join(process.cwd(), '/skeletons/', slug + '.' + file_ext_skeleton);
            fs.readFile(old_path_skeleton, function(err, data) {
                fs.writeFile(new_path_skeleton, data, function(err) {
                    fs.unlink(old_path_skeleton, function(err) {
                        if(err){
                            res.render('CreateExerciseView', {message : "Erreur lors de la création de l'exercice."});
                        }
                    });
                });
            });
        }

        //Return
        let messageCreation = "";
        if(old_path_test != null)
        {
            messageCreation = "Exercice créé";
        }
        if(old_path_correction != null)
        {
            messageCreation += ", avec correction";
        }
        if(old_path_skeleton != null)
        {
            messageCreation += ", avec squelette";
        }
        res.render('CreateExerciseView', {message : messageCreation});
    });
}