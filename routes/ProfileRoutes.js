const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/ProfileController')
const {isTeacher, isConnectedWithLocalAccount} = require('./middlewares/Authenticated')

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

/**
 * Get the page to create an exercise
 */
router.get('/create-exercises-set', isTeacher, ProfileController.getCreateExercisesSet);

/**
 * Get the settings page
 */
router.get('/settings', isConnectedWithLocalAccount, ProfileController.getSettings);
router.post('/settings/global', isConnectedWithLocalAccount,ProfileController.postSettingsGlobal);
router.post('/settings/password', isConnectedWithLocalAccount,ProfileController.postSettingsPassword);
router.post('/settings/delete_account', isConnectedWithLocalAccount,ProfileController.postSettingsDeleteAccount);

module.exports = router;