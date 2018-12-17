const express = require('express');
const router = express.Router();
const ExerciseController = require('../controllers/ExerciseController')

router.get('/:lang', ExerciseController.getExoByLang);

router.post('exo', ExerciseController.postExo);

module.exports = router;