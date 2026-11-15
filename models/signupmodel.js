
const mongoose = require("mongoose");
const signupSchema = new mongoose.Schema({

    emailid: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    utype: {
        type: String,
        enum: ["vendor", "customer"],
        required: true
    },

    status: {
        type: Number,
        default: 1
    }

}, { versionKey: false });

const signupColRef = mongoose.model(
    "Signup",
    signupSchema,
    "signupusers"
);

module.exports = signupColRef;
