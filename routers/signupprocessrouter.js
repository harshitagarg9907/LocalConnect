const express = require("express");
const router = express.Router();

const{dosignup} = require("../controller/signup-processcontroller");

router.post("/signup-process", dosignup);

module.exports = router;