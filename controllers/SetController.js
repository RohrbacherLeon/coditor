const Set = require("../models/Set");
const Exercise = require("../models/Exercise");
const ExerciseController = require("../controllers/ExerciseController");

exports.getSet = (req, res) => {
    Set.getSetBySlug(req.params.slug, function (err, data) {
        if (err) console.log(err);
        let set = data[0];
        let setExercises = [];
        set.exercises.forEach(exercise => {
            setExercises.push(Exercise.findById(exercise));
        });
        res.render("SetView", { setExercises, set });
    });
};

exports.getExerciseInSet = (req, res) => {
    req.params.setParams = { success: false };
    // get l'exo en cours
    Exercise.getExo({ slug: req.params.slug, language: req.params.lang }, function (err, data) {
        if (err) console.log(err);
        let currentEx = data;
        Set.getSetBySlug(req.params.setslug, function (err, data) {
            if (err) console.log(err);
            // get les infos du set
            let set = data[0];
            // get l'index de l'exo en cours dans le set d'exos
            let index = set.exercises.indexOf(currentEx._id);
            // si l'index de l'exo en cours est ok
            if (index >= 0 && index < set.exercises.length) {
                // si c'est le premier
                if (index === 0) {
                    // on get l'exo next
                    Exercise.findById(set.exercises[index + 1], function (err, data) {
                        if (err) console.log(err);
                        req.params.setParams.next = data;
                        ExerciseController.getExercise(req, res);
                    });
                }
                // si ce n'est pas le premier
                if (index > 0) {
                    // on get l'exo previous
                    Exercise.findById(set.exercises[index - 1], function (err, data) {
                        if (err) console.log(err);
                        req.params.setParams.previous = data;
                        // si ce n'ext pas le dernier
                        if (index < set.exercises.length - 1) {
                            // on get l'exo next
                            Exercise.findById(set.exercises[index + 1], function (err, data) {
                                if (err) console.log(err);
                                req.params.setParams.next = data;
                                ExerciseController.getExercise(req, res);
                            });
                        } else {
                            ExerciseController.getExercise(req, res);
                        }
                    });
                }
            }
        });
    });
};

exports.postExerciseInSet = (req, res) => {
    Exercise.getExo({ slug: req.params.slug, language: req.params.lang }, function (err, data) {
        if (err) console.log(err);
        let currentEx = data;
        Set.getSetBySlug(req.params.setslug, function (err, data) {
            if (err) console.log(err);
            // get les infos du set
            let set = data[0];
            // get l'index de l'exo en cours dans le set d'exos
            let index = set.exercises.indexOf(currentEx._id);
            // si l'index de l'exo en cours est ok
            if (index >= 0 && index < set.exercises.length) {
                // si c'est le premier
                if (index === 0) {
                    // on get l'exo next
                    Exercise.findById(set.exercises[index + 1], function (err, data) {
                        if (err) console.log(err);
                        req.params.setParams = {
                            next: data,
                            success: false
                        };

                        ExerciseController.postExercise(req, res);
                    });
                }
                // si ce n'est pas le premier
                if (index > 0) {
                    // on get l'exo previous
                    Exercise.findById(set.exercises[index - 1], function (err, data) {
                        if (err) console.log(err);
                        req.params.setParams = {
                            previous: data,
                            success: false
                        };
                        // si ce n'ext pas le dernier
                        if (index < set.exercises.length - 1) {
                            // on get l'exo next
                            Exercise.findById(set.exercises[index + 1], function (err, data) {
                                if (err) console.log(err);
                                req.params.setParams = {
                                    next: data,
                                    success: false
                                };
                                ExerciseController.postExercise(req, res);
                            });
                        } else {
                            ExerciseController.postExercise(req, res);
                        }
                    });
                }
            }
        });
    });
};

exports.postSetSuccess = (req, res) => {
    Set.getSetBySlug(req.params.slug, function (err, data) {
        if (err) console.log(err);
        let exo = data[0];
        if (!exo.hasSucceeded.includes(req.user.profile.email)) {
            exo.hasSucceeded.push(req.user.profile.email);
            exo.save();
        }
        req.flash("success", "Série terminée avec succès.");
        res.send("OK");
    });
};

exports.deleteSet = (req, res) => {
    Set.findById(req.params.id, (err, set) => {
        if (err) res.sendStatus(404);
        if (set.author === req.user.profile.email || set.user.type === "admin") {
            set.remove();
            set.save();
            res.sendStatus(200);
        } else {
            res.sendStatus(403);
        }
    });
};