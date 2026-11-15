var express=require("express");
var{Citizenregister,doExtractAadhaar,citizensupdate,citizensfind}=require("../controller/Citizenscontroller");
const { validateToken } = require("../config/jwtvalidation");

let router=express.Router();
router.post("/Citizenregister",Citizenregister);
router.post("/doExtractAadhaar",doExtractAadhaar);
router.post("/citizensupdate",citizensupdate);
router.post("/citizensfind",validateToken,citizensfind);
module.exports=router;