let jwt=require("jsonwebtoken");
//What it does: Imports the jsonwebtoken library so your server can verify and decode JWT tokens.
function validateToken(req, resp, next) {
    const fulltoken = req.headers["authorization"];
    console.log("HEADER:", fulltoken);          // see what arrived

    if (!fulltoken) {
        return resp.status(401).json({ status: false, msg: "No token" });
    }

    try {
        const token = fulltoken.split(" ")[1];
        const payload = jwt.verify(token, process.env.SEC_KEY);
     
        req.emailid = payload.emailid;//This line copies the email from the token and stores it on the request object, so later functions can use it.
     
       console.log("VERIFIED:", payload);
        next();
    } catch (err) {
        console.log("JWT ERROR:", err.message);  // see the real reason
        return resp.status(401).json({ status: false, msg: err.message });
    }
}


module.exports={validateToken};