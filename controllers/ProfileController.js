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
            author : req.user.email,
            description : fields.description
        }, function (err, exo) {
            if(err) console.log(err);
        })
        
        //penser a verifer l'extension du fichier de test
        //trier les fichiers de test dans un dossier nommer par l'email de l'auteur ?
        
        //verification qu'il y est bien un fichier
        if(files.file.size > 0){
            let old_path = files.file.path,
                file_size = files.file.size,
                file_ext = files.file.name.split('.').pop(),
                index = old_path.lastIndexOf('/') + 1,
                file_name = old_path.substr(index),
                
                //le nom du fichier de test associé à l'exo est le slug de l'exo
                new_path = path.join(process.cwd(), '/tests/', slug + '.' + file_ext);
            fs.readFile(old_path, function(err, data) {
                fs.writeFile(new_path, data, function(err) {
                    fs.unlink(old_path, function(err) {
                        if (err) {
                            res.render('CreateExerciseView', {message : 'erreur'});
                        } else {
                            res.render('CreateExerciseView', {message : 'exo créé'});
                        }
                    });
                });
            });
        }else{
            res.render('CreateExerciseView', {message : "Aucun fichier mis"});
        }
    });

}