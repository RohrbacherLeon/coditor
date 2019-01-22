const User = require('../models/User')
const Validator = require('../class/Validator');
const bcrypt = require('bcryptjs');
const formidable = require('formidable'),
    fs = require('fs'),
    path = require('path')

exports.getSettings = (req, res) => {
    res.render('SettingsView');
}

exports.postSettingsGlobal = (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {

        let errors = Validator.check(fields, {
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
        
        if(errors.length > 0){
            req.flash("error",errors[0].msg);
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

    let errors = Validator.check(req.body, {
        'password' : {
            rules : ['required'],
            messages : [
                'Mot de passe actuel erroné'
            ]
        },
        'new_password' : {
            rules : ['required', 'min:8'],
            messages : [
                'Vous devez choisir un nouveau mot de passe',
                'Le nouveau mot de passe doit contenir 8 caratères minimum'
            ]
        }
    })
    
    if(errors.length > 0){
        req.flash("error", errors[0].msg);
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

exports.postSettingsDeleteAccount= (req, res) => {
    let errors = Validator.check(req.body, {
        'password' : {
            rules : ['required'],
            messages : [
                'Mot de passe actuel erroné'
            ]
        }
    })

    if(errors.length > 0){
        req.flash("error", errors[0].msg);
        res.redirect('/profile/settings');
    }else{
        let actual = req.body.password

        //verifie le mdp actuel
        bcrypt.compare(actual, req.user.profile.password).then(isSame => {
            if(isSame){
                User.deleteOne({account:'local', "profile.email" : req.user.profile.email}, function (err) {
                    if (err) return console.log(err);
                    // deleted at most one tank document
                    req.flash("success", "Le compte a été supprimé");
                    res.redirect('/login')
                  });


            }else{
                req.flash("error", "Mot de passe actuel erroné");
                res.redirect('/profile/settings')
            }
            
        });
    }
}