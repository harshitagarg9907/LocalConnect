var express=require("express");

var{SaveLike,removeFavorite,fetchFavorites}=require("../controller/citizendashboard");

let router=express.Router();
router.post("/SaveLike",SaveLike);
router.post("/removeFavorite",removeFavorite);
router.post("/fetchFavorites",fetchFavorites);
module.exports=router;
