
const signupColRef = require("../models/signupmodel");
const bcrypt = require("bcryptjs");
const transporter = require("../config/mailconfig");

async function dosignup(req, resp) {
    try {

        const { emailid, password, utype } = req.body;

        // Check empty fields
        if (!emailid || !password || !utype) {
            return resp.json({
                status: false,
                msg: "All fields are required"
            });
        }

        // Convert email to lowercase and remove spaces
        const email = emailid.trim().toLowerCase();

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return resp.json({
                status: false,
                msg: "Invalid email"
            });
        }

        // Check password length
        if (password.length < 8) {
            return resp.json({
                status: false,
                msg: "Password must contain at least 8 characters"
            });
        }

        // Check user type
        if (!["vendor", "customer"].includes(utype)) {//frontend validation is not security. Someone can bypass your dropdown and directly send a request using Postman, browser DevTools or another program.
            return resp.json({// this is added so that someone may not add by themselves
                status: false,
                msg: "Invalid user type"
            });
        }

        // Check whether email already exists
        const result = await signupColRef.findOne({
            emailid: email
        });

        if (result != null) {
            return resp.json({
                status: false,
                msg: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
//bcrypt.hash()==It converts the original password into a secure hash.
       
//12 → Strong protection, commonly used.

// Create document
        let doc = new signupColRef({
            emailid: email,
            password: hashedPassword,
            utype: utype,
            status: 1
        });

        // Save in MongoDB
        await doc.save();
  
        // Prepare welcome email
        let welcomeMsg = "";

        if (utype === "vendor") {
            welcomeMsg = `
                <h2>Welcome to LocalConnect!</h2>
                <p>Dear Vendor,</p>
                <p>Your account has been successfully created.</p>
                <p>You can now connect with customers
                and grow your business with us.</p>
                <h3>Thank you for joining us!</h3>
                <p>Team LocalConnect</p>
            `;
        }
        else {
            welcomeMsg = `
                <h2>Welcome to LocalConnect!</h2>
                <p>Dear Customer,</p>
                <p>Your account has been successfully created.</p>
                <p>You can now explore local businesses
                and discover services around you.</p>
                <h3>Happy Exploring!</h3>
                <p>Team LocalConnect</p>
            `;
        }

        // Send welcome email
        try {
//This code uses Nodemailer to send a welcome email to the user after successful signup.

 


await transporter.sendMail({
                from: `"LocalConnect" <${process.env.EMAIL_USER}>`,//In JavaScript, the $ symbol is used in template literals to insert variables or expressions inside a string.
                to: email,//Specifies the recipient's email address.
                subject: "Welcome to LocalConnect!",
                html: welcomeMsg//This contains the actual email body in HTML format.
            });

            console.log("Welcome email sent successfully");

            
        }
        catch (mailErr) {
            console.log("Email sending failed:", mailErr.message);
        }

        // Send response
      
  resp.json({
            status: true,
            msg: "Signup successful"
        });
    }
   catch (err) {

    console.log(err);

    if (err.code === 11000) {
        return resp.json({
            status: false,
            msg: "Email already registered"
        });
    }

    return resp.json({
        status: false,
        msg: "Server error"
    
    });
}
}

module.exports = { dosignup };
