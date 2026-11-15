const projectColRef = require("../models/vendormodel");
var {getclodinaryobject}=require("../config/configcloud")

let cloudinary=getclodinaryobject();

     var path=require("path");
     
    async function vendorupdate(req, resp) {
    try {
        if (req.files != null && req.files.shoppicurl) {
            let filename = req.files.shoppicurl.name;
            let fullPath = path.join(__dirname, "..", "uploads", filename);

            await req.files.shoppicurl.mv(fullPath);

            let picUrlResult = await cloudinary.uploader.upload(fullPath);
            req.body.shoppicurl = picUrlResult.url;
        }

        if (req.files != null && req.files.certpicurl) {
            let filename = req.files.certpicurl.name;
            let fullPath = path.join(__dirname, "..", "uploads", filename);

            await req.files.certpicurl.mv(fullPath);

            let picUrlResult = await cloudinary.uploader.upload(fullPath);
            req.body.certpicurl = picUrlResult.url;
        }

        const result = await projectColRef.updateOne(
            { emailid: req.body.emailid },
            { $set: req.body }
        );

       if (result.matchedCount > 0) {
    resp.json({
        status: true,
        msg: result
    });
} else {
    resp.json({
        status: false,
        msg: "Vendor not found"
    });
 }}
 catch (err) {
        console.log(err);
        resp.json({ status: false, msg: err.message });
    }


}

async function vendorfind(req, resp) {
    try {
        let eid = req.emailid;//like payload.emailid
        console.log("Email:", eid);
        let result = await projectColRef.findOne({
            emailid: eid
        });

        console.log("Vendor found:", result);

        if (result != null) {
            return resp.json({
                status: true,
                msg: result
            });
        }
        else {
            return resp.json({
                status: false,
                msg: "No record"
            });
        }
    }
    catch (err) {
        console.log(err.message);

        return resp.json({
            status: false,
            msg: err.message
        });
    }
}

async function vendorSignup(req, resp)
{
        let myUrl="nopic.jpg";
  if (req.files != null && req.files.shopPic) {
   
        let fileName=req.files.shopPic.name;
        // let fullPath=__dirname+"/uploads/"+fileName;
        let fullPath=path.join(__dirname,"..","uploads",fileName);
        console.log(fullPath);

        await req.files.shopPic.mv(fullPath);
       console.log("Uploaded Successfully");

       await cloudinary.uploader.upload(fullPath).then(function(picUrlResult)
        {
            myUrl=picUrlResult.url;   //will give u the url of ur pic on cloudinary server
            console.log("************")
            console.log(myUrl);
      });
    }

      req.body.shoppicurl=myUrl;
      
     let myUrl2 = "nopic.jpg";

if (req.files != null && req.files.certificatePic) {
    let fileName2 = req.files.certificatePic.name;
    let fullPath2 = path.join(__dirname, "..", "uploads", fileName2);

    await req.files.certificatePic.mv(fullPath2);

    let picUrlResult2 = await cloudinary.uploader.upload(fullPath2);
    myUrl2 = picUrlResult2.url;

    console.log("Certificate URL:", myUrl2);
}


      req.body.certpicurl=myUrl2;
          
      if (req.body.categories) {
    req.body.selcate = JSON.parse(req.body.categories);
    delete req.body.categories;
}
      
      let doc=new projectColRef(req.body);

doc.save().then((res)=>resp.json(res)).catch((err)=>resp.send(err.message));
   
}



async function fetchCities(req, resp) {
    try {
        const cities = await projectColRef.distinct("city");

        resp.json({
            status: true,
            msg: cities
        });
    } catch (err) {
        console.log(err);
        resp.status(500).json({
            status: false,
            msg: err.message
        });
    }
}


async function findVendors(req, resp) {
    try {
        const { city, service } = req.body;

        const result = await projectColRef.find({
            city: city,
            selcate: service
        })
        .select("-certpicurl")
        .lean();//Mongoose returns plain JavaScript objects instead. These objects are lighter and generally use less memory.
//.select("-certpicurl") excludes the business certificate field.

//.lean() returns the remaining results as plain JavaScript objects.
        resp.json({
            status: true,
            msg: result
        });
    }
    catch (err) {
        console.log(err);
        resp.status(500).json({
            status: false,
            msg: err.message
        });
    }
}


async function dorateVendor(req, resp) {
    try {
        const { emailid, rating } = req.body;

        const stars = Number(rating);//   it ensures that stars is a number bcz However, req.body receives data through an HTTP request, and you shouldn't rely on the frontend always sending the expected type.

        if (
            !emailid ||
            !Number.isInteger(stars) || //n your current project, half-star ratings are not allowed. Customers can give only 1, 2, 3, 4, or 5 stars.
            stars < 1 ||
            stars > 5
        ) {
            return resp.status(400).json({
                status: false,
                msg: "Invalid rating"
            });
        }

       const result = await projectColRef.findOneAndUpdate(
    { emailid: emailid },
    {
        $inc: {//This code uses MongoDB's $inc operator, which increments (adds to) the existing values of fields.
            totalSum: stars,
            count: 1
        }
    },
    { new: true}//Returns the updated document instead of the document before the update.
);//With new: true: result contains the updated vendor document.
        if (!result) {
            return resp.status(404).json({
                status: false,
                msg: "Vendor not found"
            });
        }

        return resp.json({
    status: true,
    totalSum: result.totalSum,
    count: result.count,
    averageRating: result.count > 0
        ? result.totalSum / result.count
        : 0
});
    } catch (err) {
        console.log(err);
        resp.status(500).json({
            status: false,
            msg: err.message
        });
    }
}



// Save
    module.exports={dorateVendor,vendorSignup,vendorfind,vendorupdate,fetchCities,findVendors}