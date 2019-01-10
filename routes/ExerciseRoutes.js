const express = require('express');
const router = express.Router();
const ExerciseController = require('../controllers/ExerciseController')
const Exercise = require('../models/Exercise');

router.get('/', (req, res)=> {
    Exercise.getAllValuesOf('tags', (err, tags) => {
        res.render('BrowsingView',  {tags});
    });
    //res.redirect('/exercises/js')
});

//router.get('/:lang', ExerciseController.getExoByLang);

router.get('/:lang/:slug', ExerciseController.getExercise);
router.post('/:lang/:slug', ExerciseController.postExercise);

module.exports = router;