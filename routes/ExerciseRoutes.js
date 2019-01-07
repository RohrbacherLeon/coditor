const express = require('express');
const router = express.Router();
const ExerciseController = require('../controllers/ExerciseController')

router.get('/', (req, res)=> {
    res.redirect('/exercises/js')
});

router.get('/:lang', ExerciseController.getExoByLang);

router.get('/:lang/:slug', ExerciseController.getExercise);
router.post('/:lang/:slug', ExerciseController.postExercise);

module.exports = router;