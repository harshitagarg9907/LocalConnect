 var mongoose=require("mongoose");
var projectColRef = require("../models/vendormodel");
 function domongooseconnection()
 {
let url=process.env.ATLAS_URI;
console.log("URL =", process.env.ATLAS_URI);

 const dns=require('dns');
        dns.setServers(['8.8.8.8','8.8.4.4']);
     

        mongoose.connect(url)
    .then(() => {
        console.log("Connected to MongoDB");
       })
    .catch((err) => console.log(err.message));
 }
 module.exports={domongooseconnection}    