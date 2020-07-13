const express = require("express");
const router = express.Router();


// Route for handling doctor registration and login.
router.use('/doctor', require("./doctor"));

// Route for handling pateint data.
router.use('/patients', require("./patients"));

// Route for handling report generation.
router.use('/reports', require("./reports"));

module.exports = router;