const User = require('../models/User')
const Exercise = require('../models/Exercise')
const Validator = require('../class/Validator');
const bcrypt = require('bcryptjs');
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

exports.getSettings = (req, res) => {
    res.render('SettingsView');
}

exports.postSettingsGlobal = (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {

        Validator.check(fields, {
            'first_name' : {
                rules : ['required'],
                messages : [
                    'Le prénom doit être remplis'
                ]
            },
            'last_name' : {
                rules : ['required'],
                messages : [
                    'Le nom doit être remplis'
                ]
            },
            'email' : {
                rules : ['email'],
                messages : [
                    'L\'adresse email est invalide'
                ]
            },
        })
        
        if(Validator.getErrors().length > 0){
            req.flash("error", Validator.getErrors()[0].msg);
            res.redirect('/profile/settings');
        }else{

            let update = {}

            update['profile.first_name'] = fields.first_name
            update['profile.last_name'] = fields.last_name
            update['profile.email'] = fields.email

            if(files.file.size > 0){
                let old_path = files.file.path,
                    file_size = files.file.size,
                    file_ext = files.file.name.split('.').pop(),
                    index = old_path.lastIndexOf('/') + 1,
                    file_name = old_path.substr(index),
                    //Save test file to the avatar folder
                    new_path = path.join(process.cwd(), '/public/images/avatars/', req.user.id + '.' + file_ext),
                    save_path = `/images/avatars/${req.user.id}.${file_ext}`;
    
                    fs.readFile(old_path, function(err, data) {
                        fs.writeFile(new_path, data, function(err) {
                            fs.unlink(old_path, function(err) {
                                //test if correction
                                if (err) {
                                    res.redirect('/profile/settings');
                                } else {
                                    update['urlImage'] = save_path;
                                    User.updateOne({account:'local', "profile.email" : req.user.profile.email}, {$set :update}, function (err, user) {
                                        if (err) console.log(err);
                        
                                        res.redirect('/profile/settings')
                                    });;
                                }
                            });
                        });
                    });
    
                
            }else{
                User.updateOne({account:'local', "profile.email" : req.user.profile.email}, {$set :update}, function (err, user) {
                    if (err) console.log(err);
    
                    res.redirect('/profile/settings')
                });;
            }
        }
        
    });

}

exports.postSettingsPassword = (req, res) => {

    Validator.check(req.body, {
        'password' : {
            rules : ['required'],
            messages : [
                'Mot de passe actuel erroné'
            ]
        },
        'new_password' : {
            rules : ['required', 'min:8'],
            messages : [
                'Vous devais choisir un nouveau mot de passe',
                'Le nouveau mot de passe doit contenir 8 caratères minimum'
            ]
        }
    })
    
    if(Validator.getErrors().length > 0){
        req.flash("error", Validator.getErrors()[0].msg);
        res.redirect('/profile/settings');
    }else{

        let actual = req.body.password
        let newPassword = req.body.new_password

        //verifie le mdp actuel
        bcrypt.compare(actual, req.user.profile.password).then(isSame => {
            if(isSame){
                bcrypt.hash(newPassword, 10).then(hash => {
                    let update = {}
                    update['profile.password'] = hash
                    User.updateOne({account:'local', "profile.email" : req.user.profile.email}, {$set :update}, function (err, user) {
                        if (err) console.log(err);
                        req.flash("success", "Votre mdp a été modifié");
                        res.redirect('/profile/settings')
                    });;
                })

            }else{
                req.flash("error", "Mot de passe actuel erroné");
                res.redirect('/profile/settings')
            }
            
        });
    }
}