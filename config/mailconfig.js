require("dotenv").config(); //dotenv is a package that reads variables from your .env file.
//const nodemailer = require("nodemailer");//.config() loads those variables into process.env.


const transporter = {
    async sendMail({ to, subject, html }) {
        const res = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                sender: { name: "LocalConnect", email: process.env.EMAIL_USER },
                to: [{ email: to }],
                subject: subject,
                htmlContent: html
            })
        });

        if (!res.ok) {
            throw new Error(await res.text());
        }
    }
};

module.exports = transporter;

//A transporter is responsible for connecting to an email service and handling email delivery.
//createTransport() → Sets up your email delivery system.

//auth stands for authentication.

//It tells Nodemailer which Gmail account is authorized to send emails.