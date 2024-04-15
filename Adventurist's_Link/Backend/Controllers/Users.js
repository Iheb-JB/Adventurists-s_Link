import Users from "../Models/Users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs" ;
import { json } from "express";
import router from "../Routes/auth.js";
import { JWT_SECRET , ADMIN_SECRET_KEY } from "../config.js";
import generateToken from "../Utils/generateToken.js" ;
import UserVerification from "../Models/UserVerification.js";
import nodemailer from "nodemailer"
import { v4 as uuidv4} from "uuid";
import path from "path";
import { error } from "console";
import crypto from "crypto";
import Token from "../Models/Token.js";
import userProfile from "../Models/userProfile.js";


const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true, maxAge: 7*24*60*60 ,sameSite: "strict", });
};

const registerUser = async (req,res)=>{
    try{
        const{firstName , lastName , email , password , confirmPassword , isAdmin}= req.body;
    //check password match
    if(password !==confirmPassword){
        return res.status(400).send({error :"passwords don't match"});
    }
    // Check if any of the required fields are missing
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(400).send({ error: "All fields are required!" });
    }
    // check the password length
    if (password.length < 8) {
        return res.status(400).send({ error: "Password must be at least 8 characters long!" });
    }
     // Check if the email address is valid
     const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
     if (!emailRegex.test(email)) {
       return res.status(400).send({ error: "Invalid email address!" });
     }
     
     let isAdminValue = false ;
     // check if the user is Admin type
    if (process.env.ADMIN_SECRET_KEY && isAdmin === true) {
       isAdminValue = true;
    } 
    const user = await Users.findOne({email});
    if(user){
        return res.status(400).send({error:"email address already exists"});
    }
  // we need to encrypt our password so we can safely save it in the database
    const salt = await bcrypt.genSalt(10); // less time and safe enough 
    const hashedPassword = await bcrypt.hash(password, salt);

    const RandomTestProfilePic = "https://avatar.iran.liara.run/public"; 
// create new user
    const newUser = new Users({
       firstName,
       lastName,
       email,
       password: hashedPassword,
       isAdmin: isAdminValue,
       verified: false,
    });
//only accept valid new user data
    if(newUser){
        generateTokenAndSetCookie(newUser._id,res);
        const savedUser = await newUser.save();
        // send email verification link
         sendVerificationEmail(savedUser, res);
        
    }else{
        res.status(400).send({error: "Invalid user data!"});
    }

    }catch(error){
       console.log("Error in Signup procedure", error.message);
       res.status(500).send({error: "internal server error!"});
    } 
};

const verifyUserLogin = async (email, password) => {
    try {
      //console.log(email);
      const user = await Users.findOne({ email });
      if (!user) {
        return { status: "error", error: "user not found" };
      }
      const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
      if (isPasswordCorrect) {
        if (!user.verified) {
          return res.json({
            status: "error",
            error: "Please verify your email address to proceed.",
          });
        }
        // creating a JWT token
        const token = jwt.sign(
          {
            id: user._id,
            username: user.email,
            type: "user",
            isAdmin: user.isAdmin,
            verified: user.verified,
          },
          process.env.JWT_SECRET,
          { expiresIn: "3h" }
        );
        console.log("logged in");
        return { status: "ok", data: token };
      }
      return { status: "error", error: "invalid password" };
    } catch (error) {
      console.log(error);
      return { status: "error", error: "timed out" };
    }
};

const login = async(req,res)=>{
    
        const{email,password}= req.body;
        try{
          const user = await Users.findOne({email});
        
         // we made a function to verify our user login
         const response = await verifyUserLogin(email, password);
         //check if userProfile already exists
         let profile = await userProfile.findOne({userId:user._id});
         if(!profile){
          // create username from users
          const username = `${user.firstName}_${user.lastName}`;
          profile = new userProfile({ // create the user Profile since it does not exist
             userId: user._id,
             username: username,
             bio: "",
             profilePicture: "",
             travelerPreferences:"Party , Festivals and Events",
             identityVerified: true,
             accountStatus: 'Active',
             gender:"Male", 
             dateOfBirth: new Date(),
          });
          await profile.save();
         }
         if (response.status === "ok") {
          // storing our JWT web token as a cookie in our browser
          res
            .cookie("token", response.data, {
              httpOnly: true,
              secure: true,
              path: "/",
              SameSite: "none",
            })
            .json({ loginStatus: true }); // maxAge: 2 hours
        } else {
          res.json(response);
        }
        }catch(error){
          console.log("Error in Login:", error.message);
          res.status(500).json({ error: "Internal server error" });
        }
            
};

const logout = async(req,res)=>{
    try{
       res.cookie("jwt", "",{maxAge: 0});
       res.status(200).send({message :"Logged out successfully"});
    }catch{
        console.log("Error in Logout procedure", error.message);
       res.status(500).send({error: "internal server error!"});
    }

};
// prepare for Transporter for sending emails feature
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth:{
    user: "testpurposecd1@gmail.com",
    pass: "gnryqcaioxtmhdvd",
  },
});

transporter.verify((error,succes)=>{
 if(error){
   console.log(error);
 }else{
   console.log("ready for messages");
   console.log(succes);
 }
})

// Sending verification email logic
const sendVerificationEmail= ({_id,email} , res)=>{
    // verification url to be sent
    const currentUrl="http://localhost:8000/" ;
    const uniqueString = uuidv4()+ _id;

    const mailOptions = {
      from: "testpurposecd1@gmail.com",
      to: email,
      subject: "Verify your email address ",
      html: `<p>Verify your email address to complete your registration procedure.</p><p>This link expires in <b>4 hours.</b></p>
             <p>Press <a href="${currentUrl}api/auth/verify/${_id}/${uniqueString}">here </a> to proceed </p>`,
    };

  //hash the unique string for security reasons
  const saltRounds = 10;
  bcrypt
  .hash(uniqueString, saltRounds)
  .then((hashedUniqueString)=>{
    // set new value in userVerification collection
    const newVerification = new UserVerification({
      userId: _id,
      uniqueString: hashedUniqueString,
      createdAt: Date.now(),
      expiresAt: Date.now()+ 14400000 , // expires after 4 hours 
    });
    newVerification
     .save()
     .then(()=>{
       transporter
       .sendMail(mailOptions)
       .then(()=>{
          // email sent and verification sent 
          res.json({
            status: "PENDING",
            message: "Verification email sent",
          })
       })
       .catch((error)=>{
         console.log(" Email verification failed", error.message);
         //res.redirect(`/auth/verified?message=Verification%20email%20failed%20to%20send`);
        })
     })
     .catch((error)=>{
      console.log("Error in Sending Email verification", error.message);
      //res.redirect(`/auth/verified?message=Verification%20email%20failed%20to%20save`);
     })
  })
  .catch((error)=>{
    console.log("General error in sending emails", error.message);
    //res.redirect(`/auth/verified?message=General%20error%20in%20sending%20emails`);
  })
}

//forgot password function
const forgotPassword = async(req, res, next)=>{
  const user = await Users.findOne({email: req.body.email});
  if (!user){ // check if the user exists
    return res.status(400).send("user with given email doesn't exist");
  }
// create password reset token
  let reseToken = await Token.findOne({ userId: user._id });
    if (!reseToken) {
      reseToken = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }
//setting email options to send 
    const currentUrl="http://localhost:8000/" ;
    const resetUrl = `${req.protocol}://${currentUrl}api/auth/resetPassword/${user._id}/${reseToken.token}`
    const mailOptions = {
      from: "testpurposecd1@gmail.com",
      to: user.email,
      subject: "Reset your Adventurist's Link password ",
      html: `<p>We have received a password reset request .</p><p>This link expires in <b>10 minutes.</b></p>
             <p>Please press <a href="${resetUrl}">here </a> to reset your password ! </p>`,
    };
    try{// sending the reset link to user
        await transporter.sendMail(mailOptions);
        res.status(200).json({
          status: 'success',
          message: 'password reset link sent to the user email !'
        })
    }catch(error){
      console.log("Sending password reset Email failed", error.message);
    }    
}

//reset password controller
const resetpassword = async(req, res)=>{
  try{
    const  {userId , token} = req.params ;
    const user = await Users.findById(userId);
    
    if (!user) return res.status(401).send("invalid link or expired");
    //find the token 
    const tokenDoc = await Token.findOne({
      userId: userId,
      token: token,
    });
    //console.log(tokenDoc);
    // check if the token expired
    if (!tokenDoc) return res.status(403).send("Invalid link or expired");
    
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).send("Passwords do not match");
    }
    user.password = req.body.password;
  // hash the new password and save it to DB
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    await tokenDoc.deleteOne();
    //console.log(user); testing errors purposes 

    res.send("password reset sucessfully.");
    console.log("password reset done");
  }catch(error){
    console.log("Resetting password failed !", error.message);
  }
 
}


export { registerUser , login , logout  ,forgotPassword , resetpassword};