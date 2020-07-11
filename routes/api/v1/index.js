const express = require("express");
const router = express.Router();


router.use('/doctor', require("./doctor"));

module.exports = router;