const jwt = require("jsonwebtoken");
const signupColRef = require("../models/signupmodel");
const bcrypt = require("bcryptjs");

async function dologin(req, resp) {
    try {

        const { emailid, password } = req.body;

        // Check empty fields
        if (!emailid || !password) {
            return resp.json({
                status: false,
                msg: "Please enter email and password"
            });
        }

        // Convert email to lowercase and remove spaces
        const email = emailid.trim().toLowerCase();

        // Find user in MongoDB
        const result = await signupColRef.findOne({
            emailid: email
        });

        // Check whether email exists
        if (result == null) {
            return resp.json({
                status: false,
                msg: "Incorrect email ID or password"
            });
        }

        // Check account status
        if (result.status !== 1) {
            return resp.json({
                status: false,
                msg: "Your account is inactive"
            });
        }

        // Compare entered password with hashed password
        const isMatch = await bcrypt.compare(
            password,
            result.password
        );

        if (!isMatch) {
            return resp.json({
                status: false,
                msg: "Incorrect email ID or password"
            });
        }

        let jtoken=jwt.sign({emailid:req.body.email},process.env.SEC_KEY,{expiresIn:"15m"});
                console.log(jtoken);

        // Login successful
        return resp.json({
            status: true,
           
            utype: result.utype,
            emailid: result.emailid
            ,msg:"Record Saved Successfullyyy",token:jtoken
         
        });

    }
    catch (err) {

        console.log(err);

        return resp.status(500).json({
            status: false,
            msg: "Server error"
        });
    }
}

module.exports = { dologin };
