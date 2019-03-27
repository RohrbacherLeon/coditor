const Set = require("../models/Set");
const Exercise = require("../models/Exercise");

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