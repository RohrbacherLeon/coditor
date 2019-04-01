const express = require("express");
const router = express.Router();
const ProfileController = require("../controllers/ProfileController");
const { isTeacher } = require("./middlewares/Authenticated");

/**
 * Get the profile of the user
 */
router.get("/", ProfileController.getProfile);

/**
 * Get the page to create an exercise
 */
router.get("/create-exercise", isTeacher, ProfileController.getCreateExercise);

/**
 * When teacher created an exercise
 */
router.post("/create-exercise", isTeacher, ProfileController.postCreateExercise);

/**
 * Get the page to update an exercise
 */
router.get("/update-exercise/:lang/:slug", isTeacher, ProfileController.getUpdateExercise);

/**
 * When teacher updated an exercise
 */
router.post("/update-exercise/:lang/:slug", isTeacher, ProfileController.postUpdateExercise);

/**
 * Get the page to create an exercise set
 */
router.get("/create-exercises-set", isTeacher, ProfileController.getCreateExercisesSet);

/**
 * When teacher created an exercise set
 */
router.post("/create-exercises-set", isTeacher, ProfileController.postCreateExercisesSet);

module.exports = router;