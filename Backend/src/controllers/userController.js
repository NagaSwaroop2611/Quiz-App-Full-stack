const bcrypt = require("bcrypt");
const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const registerUser = async (req,res) => {
  try {
    // Take input from user
    const {name,email,password} = req.body;

    // Validation
    if(!name || !email || !password){
      return res.status(400).json({
        message:"Name,email,password is required to register",
      })
    }

    // check if user exists or not
    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({message:"User already exists"});
    }

    // hashing password
    const hashedPassword = await bcrypt.hash(password,10);

    // create a user 
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user
    await user.save();

    // response
    res.status(201).json({message:"User registed succesfully",user:{
      _id: user._id,
      name: user.name,
      email : user.email
    }});
  } catch (error) {
    res.status(400).json({message:"User registeration failed"});
  }
};

const loginUser = async(req,res) => {
  try {

    // get input from req.body
    const {email,password} = req.body;

    // validation
    if(!email || !password){
      return res.status(400).json({
        message: "Email and password required to login"
      });
    }

    // check if user exists or not
    const user = await User.findOne({email});

    if(!user){
      return res.status(400).json({
        message:`No user exits with ${email} email id`
      });
    }

    // check for password
    const isPasswordValid = await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
      return res.status(401).json({message:"Invalid Credentials"});
    }
    
    // Generate JWT token
    const accessToken = jwt.sign(
      {userId:user._id},
      process.env.JWT_SECRET_TOKEN,
      {expiresIn: "5h"}
    );

    res.status(200).json({accessToken});
  } catch (error) {
    console.error("Error Logging in ",error);
    res.status(500).json({
      success : false,
      message : error.message
    });
  }
};

const quizAttempts = async (req,res) => {
  try {
    const userId = req.user._id;
    const attempts = await User.findById(userId).populate("quiz_attempts");
    // console.log(attempts);
    
    res.status(200).json({attempts: attempts.quiz_attempts});

  } catch (error) {
   console.error("Error fetching quiz attempts",error.message);
   res.status(500).json({
    success: false,
    message: error.message
   }); 
  }
};


module.exports = {registerUser,loginUser,quizAttempts}