const express = require("express");
const router = express.Router();
const passport = require("passport");

const customMiddleWare = require("../../../config/custom-middleware");

const reportsApi = require("../../../controllers/api/reports_api");

router.get("/:status", passport.authenticate("jwt", {session:false, failWithError:true}), customMiddleWare.handleError, reportsApi.getReportsByStatus);

module.exports = router;