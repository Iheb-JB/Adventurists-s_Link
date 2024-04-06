import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const generateTokenAndSetCookie = (userId , res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn: "7d",});
 
    res.cookie("jwt", token,{
     httpOnly: true,
     maxAge : 7*24*60*60 , // im seconds
     sameSite: "strict",
    })
 };
 
 export default generateTokenAndSetCookie;