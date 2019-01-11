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

/**
 * Function used to save a file (Test, Correction and Skeleton). Return "ok" if no error.
 * @param {*} file the file
 * @param {*} repertory repertory where the file are save.
 * @param {*} slug 
 * @param {*} res 
 */
function saveFile(file, repertory, slug, res){
        let old_path = file.path,
        file_size = file.size,
        file_ext = file.name.split('.').pop(),
        index = old_path.lastIndexOf('/') + 1,
        file_name = old_path.substr(index),
        
        //Save test file to the folder tests
        new_path = path.join(process.cwd(), '/' + repertory + '/', slug + '.' + file_ext);
    fs.readFile(old_path, function(err, data) {
        fs.writeFile(new_path, data, function(err) {
            fs.unlink(old_path, function(err) {
                if(err){
                    res.render('CreateExerciseView', {message : "Erreur lors de la création de l'exercice."});
                }else{
                    return "ok";
                }
            });
        });
    });
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
        
        //if a file "Test" exist
        let test_file;
        if(files.file.size > 0){
            test_file = saveFile(files.file, "tests", slug, res);
        }else{
            res.render('CreateExerciseView', {message : "Aucun fichier de test donné."});
        }

        //test if correction exist
        let correction_file;
        if(files.file_correction.size > 0){
            correction_file = saveFile(files.file_correction, "corrections", slug, res);
        }

        //test if skeleton exist
        let skeleton_file;
        if(files.file_skeleton.size > 0){
            skeleton_file = saveFile(files.file_skeleton, "skeletons", slug, res);
        }

        //Return
        let messageCreation = "";
        if(test_file != null)
        {
            messageCreation = "Exercice créé";
        }
        if(correction_file != null)
        {
            messageCreation += ", avec correction";
        }
        if(skeleton_file != null)
        {
            messageCreation += ", avec squelette";
        }
        res.render('CreateExerciseView', {message : messageCreation});
    });
}