const express = require("express");
const router = express.Router();


router.use('/doctor', require("./doctor"));
router.use('/patients', require("./patients"));
router.use('/reports', require("./reports"));

module.exports = router;