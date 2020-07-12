const express = require("express");
const router = express.Router();
const passport = require("passport");
const customMiddleWare = require("../../../config/custom-middleware");

const doctorApi = require("../../../controllers/api/doctor_api");

router.post('/register', doctorApi.create);

router.post('/login', passport.authenticate('local', { session: false, failWithError: true }),
    customMiddleWare.handleError, doctorApi.generateKey);

module.exports = router;