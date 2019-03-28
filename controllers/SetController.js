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
        console.log(set);
        res.render("SetView", { setExercises, set });
    });
};

exports.getExerciseInSet = (req, res) => {
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
            let setParams = {
                previous: null,
                next: null
            };
            // si l'index de l'exo en cours est ok
            if (index >= 0 && index < set.exercises.length) {
                // si c'est le premier
                if (index === 0) {
                    // on get l'exo next
                    Exercise.findById(set.exercises[index + 1], function (err, data) {
                        if (err) console.log(err);
                        setParams.next = data;
                        ExerciseController.getExercise(req, res, setParams);
                    });
                }
                // si ce n'est pas le premier
                if (index > 0) {
                    // on get l'exo previous
                    Exercise.findById(set.exercises[index - 1], function (err, data) {
                        if (err) console.log(err);
                        setParams.previous = data;
                        // si ce n'ext pas le dernier
                        if (index < set.exercises.length - 1) {
                            // on get l'exo next
                            Exercise.findById(set.exercises[index + 1], function (err, data) {
                                if (err) console.log(err);
                                setParams.next = data;
                                ExerciseController.getExercise(req, res, setParams);
                            });
                        } else {
                            ExerciseController.getExercise(req, res, setParams);
                        }
                    });
                }
            }
        });
    });
};