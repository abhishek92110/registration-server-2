var jwt = require("jsonwebtoken");

const jwt_secret = "uuu"

const fetchuser =(req, res, next)=>{
    // get the user from the jwt token and dd id to req object
    console.log("calling fetchuser");
    const token =  req.header('auth-token');
    if(token==="null")
    {
        console.log("token is not running",token)
        res.status(401).send({"error":"you are unauthorized"});
    }
    try{
        console.log("try is running");
    const data = jwt.verify(token, jwt_secret);
    
    req.user = data.user;
    console.log("data",req.user);
    next();
    }
    catch(error){
       console.log('error =',error.message)
        res.status(401).send({"error":"you are unauthorized"});
    }
}
module.exports = fetchuser;