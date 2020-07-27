const express = require("express");
const router = express.Router();
const passport = require("passport");

const customMiddleWare = require("../../../config/custom-middleware");

const reportsApi = require("../../../controllers/api/reports_api");

// Generate report by status
router.get("/:status",reportsApi.getReportsByStatus);

module.exports = router;