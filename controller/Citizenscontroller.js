const citizensref = require("../models/Citizensmodel");
var {getclodinaryobject}=require("../config/configcloud")

let cloudinary=getclodinaryobject();


const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY 
});

const SYSTEM_PERSONA = `You are an expert Document OCR and Identity Verification AI specializing in Indian Aadhaar cards.
Extract identity details accurately from the card image(s).
Rules:
1. Extract ONLY visible text. Do NOT guess or hallucinate.
2. If any field is unreadable, blurred, or missing, return null for that field.
3. If both front and back are provided, merge details: front has Name, DOB, Gender, and 12-digit number; back has Address.
4. Extract English text for name and address.
5. Return pure 12 digits for Aadhaar card number (e.g. 543289104721).
6. Output raw JSON only.
7.If a url is "nopic.jpg" avoid that and move to the next url
`;


const EXTRACTION_PROMPT = `Extract the citizen details from the provided Aadhaar image(s) into this exact JSON structure:
{
  "name": "Full Name in English or null",
  "dob": "YYYY-MM-DD or DD/MM/YYYY or null",
  "gender": "Male, Female, Other, or null",
  "acardno": "12-digit number without spaces or null",
 
    "address": "Full street and locality address or null",
    "city": "City or District or null"
  ,
 "confidenceScore": "A number between 0 and 1 representing confidence in the extracted details"
}`;


async function CallAi(imgUrls, userPrompt = EXTRACTION_PROMPT) {
    try {
        console.log(imgUrls)
        imgUrls = imgUrls.filter(url => url !== "nopic.jpg");
        console.log(imgUrls); 
        const urlList = imgUrls;
        // Fetch each Cloudinary image and convert to base64 inlineData
        const imageParts = [];
        for (const url of urlList) {
            if (!url) continue;
            const imageResp = await fetch(url).then((response) => response.arrayBuffer());
            const base64Image = Buffer.from(imageResp).toString("base64");

            imageParts.push({
                inlineData: {
                    data: base64Image,
                    mimeType: "image/jpeg",
                },
            });
        }

        if (imageParts.length === 0) {
            throw new Error("No images available to send to AI");
        }

        // Pass userPrompt and all image parts together
        const result = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite", 
            contents: [
                userPrompt,
                ...imageParts // Spreads both front and back images
            ],
            config: {
                systemInstruction: SYSTEM_PERSONA,
                responseMimeType: "application/json",
                temperature: 0.1,
            },
        });

        console.log("Raw Response from Gemini:", result.text);

        const jsonData = JSON.parse(result.text);
        return jsonData;
    } catch (err) {
        console.error("AI Extraction Error:", err);
        throw err;
    }


}



  var path=require("path");

async function doExtractAadhaar(req, resp) {
  try {
    let myUrl1="nopic.jpg"
    let myUrl2="nopic.jpg"

    // Check express-fileupload files
    if (req.files) {
      if (req.files.frontPic) {
        let fileName1 = req.files.frontPic.name;

        let fullPath1 = path.join(__dirname, "..", "uploads", fileName1);
        console.log(fullPath1);

        await req.files.frontPic.mv(fullPath1);
        console.log("Uploaded Successfully");

        const picUrlResult1 = await cloudinary.uploader.upload(fullPath1);
        myUrl1 = picUrlResult1.url;
        console.log("************");
        console.log(myUrl1);
      }

      if (req.files.backPic) {
        let fileName2 = req.files.backPic.name;

        let fullPath2 = path.join(__dirname, "..", "uploads", fileName2);
        console.log(fullPath2);

        await req.files.backPic.mv(fullPath2);
        console.log("Uploaded Successfully");

        const picUrlResult2 = await cloudinary.uploader.upload(fullPath2);
        myUrl2 = picUrlResult2.url;
        console.log("************");
        console.log(myUrl2);
      }
    }
  
    let imageParts = [myUrl1, myUrl2];

    console.log(`[CustomerController] Processing Aadhaar OCR with ${imageParts.length} image(s)...`);
    const extractedData = await CallAi(imageParts);
    return resp.json({
      status: true,
      msg: extractedData
    });
} catch (err) {
  console.error("[CustomerController] OCR Extraction Error:", err);
  return resp.status(500).json({
    status: false,
    message: err.message || "Failed to process Aadhaar card OCR"
  });
}
}
// Save extracted Aadhaar details in MongoDB
async function Citizenregister(req, resp) {
    try {
    
        const doc = new citizensref(req.body);
        const result = await doc.save();
      resp.json({
            status: true,
            message: result,
            id: result._id,
            database: citizensref.db.name,
            collection: citizensref.collection.name
        });
 
    } catch (err) {
        console.log("SAVE ERROR:", err.message);

        resp.status(500).json({
            status: false,
            message: err.message
        });
    }
}



/*
async function citizensupdate(req, resp) {
    try {
        const result = await citizensref.findOneAndUpdate(
            { emailid: req.body.emailid },
            {
                $set: {
                    name: req.body.name,
                    address: req.body.address,
                    acardno: req.body.acardno,
                    dob: req.body.dob,
                    gender: req.body.gender,
                    city: req.body.city,
                    contact: req.body.contact
                }
            },
            { returnDocument: "after" }
        );

        if (!result) {
            return resp.json({
                status: false,
                message: "Citizen not found"
            });
        }

        resp.json({
            status: true,
            message: result,
            id: result._id,
            database: citizensref.db.name,
            collection: citizensref.collection.name
        });

    } catch (err) {
        console.log("UPDATE ERROR:", err.message);

        resp.status(500).json({
            status: false,
            message: err.message
        });
    }
}

*/

 async function citizensupdate(req, resp) {
    try {
        if (req.files != null && req.files.frontPic) {
            let filename = req.files.frontPic.name;
            let fullPath = path.join(__dirname, "..", "uploads", filename);

            await req.files.frontPic.mv(fullPath);

            let picUrlResult = await cloudinary.uploader.upload(fullPath);
            req.body.frontPic = picUrlResult.url;
        }

        if (req.files != null && req.files.backPic) {
            let filename = req.files.backPic.name;
            let fullPath = path.join(__dirname, "..", "uploads", filename);

            await req.files.backPic.mv(fullPath);

            let picUrlResult = await cloudinary.uploader.upload(fullPath);
            req.body.backPic = picUrlResult.url;
        }
        const result = await citizensref.updateOne(
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
        msg: "citizen not found"
    });
 }}
 catch (err) {
        console.log(err);
        resp.json({ status: false, msg: err.message });
    }

}



  function citizensfind(req,resp)
    {
        let eid=req.emailid;
            citizensref.findOne({"emailid":eid}).then((result)=>
            { console.log(result);
    if(result!=null)
    {
        resp.json({status:true ,msg:result})
    }
    else{
        resp.json({status:false,msg:"no record"})
    }})
   
        .catch((err) => {
            console.log(err.message);
            resp.json({
                status: false,
                msg: err.message
            });
        });
}






module.exports = {
    doExtractAadhaar,
    Citizenregister,citizensupdate,citizensfind
};
