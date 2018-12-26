const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise')

const formidable = require('formidable'),
      fs = require('fs'),
      path = require('path'),
      slugify = require('slugify')
 

router.get('/', (req, res) =>{
    if(req.user.type == "student"){
        res.render('ProfileView');
    }
    else{
        Exercise.countDocuments({author:req.user.email}, (err,count) => {
           res.render('ProfileTeacherView', {
               count
           });
        })

    }
});

router.get('/create-exercise', (req, res) =>{
    res.render('CreateExerciseView');
   
});

router.post('/create-exercise', (req, res) =>{
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

});

module.exports = router;