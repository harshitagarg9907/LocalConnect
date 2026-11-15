var {validateToken} =require("../config/jwtvalidation");
const express = require("express");
const router = express.Router();

const {dologin} = require("../controller/logincontroller");

router.post("/login-process" ,dologin);

module.exports = router;
