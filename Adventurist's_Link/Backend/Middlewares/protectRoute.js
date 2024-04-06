import jwt, { decode } from "jsonwebtoken";
import Users from "../Models/Users.js";
import { JWT_SECRET } from "../config.js";

const protectRoute = async (req,res,next)=>{
    let token ;
   try{
      token = req.cookies.token;
       if(!token){
         return res.status(401).json({error:"Unauthorised - No token found!"});
       }
       // check if the cookie validity 
       const decoded = jwt.verify(token,process.env.JWT_SECRET);
       //check the decoded value if it's true or existing
       if(!decoded){
        return res.status(401).json({error:"Unauthorised - No token found in decoded!"});
       }
       
       const user = await Users.findById(decoded.id).select("-password"); 
       if( !user){
        res.status(500).json({error: "user not found !"});
       }
       req.user = user ;
       next();
    }catch(error){
      console.log("error in protect Route MDWR:" , error.message);
       res.status(500).json({error: "internal server error:${error.message}"});
    }
}

export {protectRoute};