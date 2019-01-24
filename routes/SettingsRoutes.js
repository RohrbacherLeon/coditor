const express = require("express");
const router = express.Router();
const { isConnectedWithLocalAccount } = require("./middlewares/Authenticated");
const SettingsController = require("../controllers/SettingsController");

/**
 * Get the settings page
 */
router.get("/", isConnectedWithLocalAccount, SettingsController.getSettings);
router.post("/global", isConnectedWithLocalAccount, SettingsController.postSettingsGlobal);
router.post("/password", isConnectedWithLocalAccount, SettingsController.postSettingsPassword);
router.post("/delete_account", isConnectedWithLocalAccount, SettingsController.postSettingsDeleteAccount);

module.exports = router;
