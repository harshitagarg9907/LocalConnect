var express=require("express");
var cors=require("cors")
var {domongooseconnection}=require("./config/mongooseconnect");
var visitorsrouter=require("./routers/vendorrouter");
var citizenrouter=require("./routers/citizensrouter");
var citizendashboardrouter=require("./routers/citizendashboardrouter");
var signuprouter=require("./routers/signupprocessrouter");
var loginrouter=require("./routers/loginrouter");


let app=express();

var fileuploader=require("express-fileupload");
app.use(fileuploader());
app.use(cors( {origin:"https://local-connectfrontend-eosin.vercel.app/",credentials:true}));
app.use(express.json());
require('dotenv').config();//reading .env file
domongooseconnection();

app.use(express.urlencoded({ extended: true }));//convert POST data to JSON object
app.use("/vendorrouter",visitorsrouter);

app.use("/citizenrouter",citizenrouter);
app.use("/citizendashboardrouter",citizendashboardrouter);
app.use("/signup",signuprouter);
app.use("/login",loginrouter);
app.listen(2010,function(req,resp)
{
    console.log("server started");
})