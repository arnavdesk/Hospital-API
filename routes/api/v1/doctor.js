const express = require("express");
const router = express.Router();

const doctorApi = require("../../../controllers/api/doctor_api");

router.post('/register', doctorApi.create);

module.exports = router;