var mongoose=require("mongoose")
 let colDesign = {
    emailid: { type: String, required: true, unique: true },
       name:{ type: String },
    address:{ type: String },
    acardno: { type: String },
    dob: { type: String },
    gender: { type: String },
    city: { type: String },
    contact:{ type: String }
};
var ver={
    versionKey:false,
};
let ScheemaClass=mongoose.Schema;
let collectionObj=new ScheemaClass(colDesign,ver);
let citizensref = mongoose.model("citizens", collectionObj);

module.exports = citizensref;