const express = require("express");
const router = express.Router();
const passport = require("passport");

const customMiddleWare = require("../../../config/custom-middleware");

const patientsApi = require("../../../controllers/api/patients_api");


router.post('/register', passport.authenticate("jwt", {session:false, failWithError:true}), customMiddleWare.handleError ,patientsApi.create);

router.post('/:id/create_report',passport.authenticate("jwt", {session:false, failWithError:true}), customMiddleWare.handleError,patientsApi.createReport );

router.post('/:id/all_reports',patientsApi.allReports);



module.exports = router;