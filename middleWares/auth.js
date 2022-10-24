const jwt = require("jsonwebtoken");
const { config } = require("../conifg/secret");


exports.authToken = (req,res,next) => {
    let token = req.header("x-api-key");
    if(!token){
        res.status(401).json({msg:"you must send token !"})
    }
    try{
        let decodeToken = jwt.verify(token,config.tokenSecret)
        req.tokenData = decodeToken
      next();
    }
    catch(err){
       return res.status(401).json({msg:"token invalid or expired"})
    }
}

exports.authAdmin = (req,res,next) => {
    let token = req.header("x-api-key");
    if(!token){
      return res.status(401).json({msg:"You need to send token to this endpoint url"})
    }
    try{
      let decodeToken = jwt.verify(token,config.tokenSecret);
      // check if the role in the token of admin
      if(decodeToken.role != "admin"){
        return res.status(401).json({msg:"Token invalid or expired, code: 3"})
      }
     
    
      req.tokenData = decodeToken;
  
      next();
    }
    catch(err){
      console.log(err);
      return res.status(401).json({msg:"Token invalid or expired, log in again or you hacker!"})
    }
  }
