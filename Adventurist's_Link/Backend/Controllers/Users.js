import Users from "../Models/Users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs" ;
import { json } from "express";
import { JWT_SECRET , ADMIN_SECRET_KEY } from "../config.js";
import generateToken from "../Utils/generateToken.js" ;


const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true, maxAge: 7*24*60*60 ,sameSite: "strict", });
};

const registerUser = async (req,res)=>{
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    console.log("ADMIN_SECRET_KEY:", process.env.ADMIN_SECRET_KEY);
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

    const newUser = new Users({
       firstName,
       lastName,
       email,
       password: hashedPassword,
       isAdmin: isAdminValue,
    });
//only accept valid new user data
    if(newUser){
        generateTokenAndSetCookie(newUser._id,res);
        await newUser.save();
        res.status(200).send({
            _id : newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            loginStatus: true, 
        });
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
        // creating a JWT token
        const token = jwt.sign(
          {
            id: user._id,
            username: user.email,
            type: "user",
            isAdmin: user.isAdmin,
          },
          "JWT_SECRET",
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
        const user = Users.findOne({email});
        
         // we made a function to verify our user login
         const response = await verifyUserLogin(email, password);

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

export { registerUser , login , logout };