 var mongoose=require("mongoose")


 let colDesign = {
    emailid: { type: String, required: true, unique: true },
    name: { type: String },
    contact: { type: String },
    services: { type: String },
    area: { type: String },
    address: { type: String },
    city: { type: String },
    estd: { type: String },
    website: { type: String },
    insta: { type: String },
    selcate: [{ type: String }],
    shoppicurl: { type: String },
    certpicurl: { type: String },
 totalSum: {
        type: Number,
        default: 0
    },

    count: {
        type: Number,
        default: 0
    }

};
var ver={
    versionKey:false,
};
let ScheemaClass=mongoose.Schema;
let collectionobj=new ScheemaClass(colDesign,ver);
let projectColRef = mongoose.model("projectsepmvc", collectionobj, "projectsepmvc");// written like this because earlier mongoose added a 's' at the end by itself and was checking is projectsepmvcs which does not exist
module.exports = projectColRef;
