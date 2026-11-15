var mongoose = require("mongoose");

let colDesign = {
    Wedding: [String],
    Birthday: [String],
    Engagement: [String],
    Anniversary: [String],
    Holi: [String],
    Diwali: [String],
    Festival: [String],
    CorporateEvent: [String]

    
};

var ver = {
    versionKey: false
};

let ScheemaClass = mongoose.Schema;
let collectionObj = new ScheemaClass(colDesign, ver);

let eventsref = mongoose.model("events", collectionObj);

module.exports = eventsref;