var mongoose=require("mongoose");
 let colDesign = {
    citizensemailid: { type: String },
     service: {type:String},
    vendorsemailid:{ type: String }
};
var ver={
    versionKey:false,
};
let ScheemaClass=mongoose.Schema;
let collectionObj=new ScheemaClass(colDesign,ver);
let favendorref = mongoose.model("favs", collectionObj, "favs");
module.exports = favendorref;