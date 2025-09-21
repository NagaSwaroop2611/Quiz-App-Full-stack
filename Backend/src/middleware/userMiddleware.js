const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");


const authenticateUser = async (req,res,next) => {
  const token = req.headers.authorization?.replace("Bearer ","");

  if(!token){
    return res.status(401).json({message:"Access token is missing"});
  }

  jwt.verify(token,process.env.JWT_SECRET_TOKEN,async(err,decoded) => {
    if(err){
      return res.status(403).json({message:"Invalid Token"});
    }
    try {
      const user = await User.findById(decoded.userId);
      if(!user){
        return res.status(403).json({message:"User not Found"})
      }
      req.user = user;
      // console.log("User_id",(req.user));
      next();
    } catch (error) {
      console.error("Error authencation user",error);
      return res.status(500).json({
        success:false,
        message: error.message
      });
    }
  });
};

module.exports = authenticateUser;