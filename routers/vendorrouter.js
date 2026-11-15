var express=require("express");
var{dorateVendor,vendorSignup,vendorfind,vendorupdate,fetchCities,findVendors}=require("../controller/vendorcontroller");
const { validateToken } = require("../config/jwtvalidation");

let router=express.Router();
router.post("/vendorsignup",vendorSignup);
router.post("/vendorfind",validateToken,vendorfind);

router.post("/vendorupdate",vendorupdate);

router.post("/fetchCities",fetchCities);
router.post("/findVendors",validateToken, findVendors);
router.post("/rate-vendor", dorateVendor);
module.exports=router;