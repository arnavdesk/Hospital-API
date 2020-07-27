const express = require("express");
const router = express.Router();
const passport = require("passport");

const customMiddleWare = require("../../../config/custom-middleware");

const patientsApi = require("../../../controllers/api/patients_api");


// route for registering patients
router.post('/register', passport.authenticate("jwt", {session:false, failWithError:true}), customMiddleWare.handleError ,patientsApi.create);

// route for generating report
router.post('/:id/create_report',passport.authenticate("jwt", {session:false, failWithError:true}), customMiddleWare.handleError,patientsApi.createReport );

// route for viewing all reports of a patient
router.get('/:id/all_reports',patientsApi.allReports);

module.exports = router;