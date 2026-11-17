require("dotenv").config(); //dotenv is a package that reads variables from your .env file.
const nodemailer = require("nodemailer");//.config() loads those variables into process.env.

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = transporter;

//A transporter is responsible for connecting to an email service and handling email delivery.
//createTransport() → Sets up your email delivery system.

//auth stands for authentication.

//It tells Nodemailer which Gmail account is authorized to send emails.