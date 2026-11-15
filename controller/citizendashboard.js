const favendorref = require("../models/citizendashboard");
const vendorref =require ("../models/vendormodel")


async function SaveLike(req, resp) {
    try {
          const doc = new favendorref(req.body);
        const result = await doc.save();

        resp.json({ status: true, msg: result });
    } catch (err) {
        console.log(err);
        resp.status(500).json({ status: false, msg: err.message });
    }
}

async function removeFavorite(req, resp) {
    try {
        await favendorref.deleteOne({
            citizensemailid: req.body.citizensemailid,
            vendorsemailid: req.body.vendorsemailid
        });

        resp.json({ status: true, msg: "Removed from favourites" });
    }
    catch (err) {
        resp.status(500).json({ status: false, msg: err.message });
    }
}

async function fetchFavorites(req, resp) {
    try {
        const favs = await favendorref.find({
            citizensemailid: req.body.citizensemailid
        });

        const emails = favs.map(item => item.vendorsemailid);

        const vendors = await vendorref.find({
            emailid: { $in: emails }
        });

        const result = vendors.map(vendor => {
           const fav = favs.filter(// fav has service, vendoremail,citizenemail
    item => item.vendorsemailid === vendor.emailid
);

return {
    ...vendor.toObject(),//converts the Mongoose document into a normal JavaScript object.
    service: fav.map(item => item.service).join(", ") || "Not provided"// fav had all three we are sending only the required one.
};
        });

        resp.json({ status: true, msg: result });
    }
    catch (err) {
        resp.status(500).json({
            status: false,
            msg: err.message
        });
    }
}
                                                                 /*favs=[
                                                            {
                                                          _id: "101",
                                                            citizensemailid: "abc@gmail.com",
                                                                  vendorsemailid: "v1@gmail.com"
                                                            },
                                                              {
                                                             _id: "102",
                                                               citizensemailid: "abc@gmail.com",
                                                            vendorsemailid: "v2@gmail.com"
                                                                          }] */





module.exports = { SaveLike,removeFavorite,fetchFavorites };
