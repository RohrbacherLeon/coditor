const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/ProfileController')
const {isTeacher} = require('./middlewares/Authenticated')

/**
 * Get the profile of the user
 */
router.get('/', ProfileController.getProfile);

/**
 * Get the page to create an exercise
 */
router.get('/create-exercise', isTeacher, ProfileController.getCreateExercise);

/**
 * When teacher created an exercise 
 */
router.post('/create-exercise', isTeacher, ProfileController.postCreateExercise);

module.exports = router;