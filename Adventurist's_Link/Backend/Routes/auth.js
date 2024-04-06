import express from "express";
import isAdmin from "../Middlewares/isAdmin.js";
import { registerUser, login , logout, forgotPassword, resetpassword} from "../Controllers/Users.js";
import UserVerification from "../Models/UserVerification.js";
import bcrypt from "bcryptjs" ;
import Users from "../Models/Users.js";
import path from "path";
import { fileURLToPath } from 'url';



const router = express.Router();
router.post("/signup", registerUser);
router.post("/login" , login);
router.post("/logout" , logout);
router.post("/forgetpassword", forgotPassword);
router.patch("/resetpassword/:userId/:token",resetpassword);

// verify email route
router.get("/verify/:userId/:uniqueString",(req,res)=>{
    let {userId , uniqueString} = req.params;

    UserVerification
     .find({userId})
     .then((result)=>{
       if(result.length > 0){ // verification record exists - 
          const {expiresAt} = result[0];
          const hashedUniqueString = result[0].uniqueString;
          if(expiresAt < Date.now()){ //check for expiration of the link
               UserVerification
                 .deleteOne({userId})
                 .then(result => { // deleting the created Users record as well to avoid duplication in DB
                    Users
                     .deleteOne(userId)
                     .then(()=>{
                      let message ="Link Has expired!";
                      res.redirect(`/auth/verified/error=true&message=${message}`);
                      })
                     .catch(error =>{
                      let message ="Clearing Users record with expired link failed!";
                      res.redirect(`/auth/verified/error=true&message=${message}`);
                      })
                 })
                 .catch((error)=>{
                    console.log(error);
                    let message ="Error while deleting user verification record !";
                    res.redirect(`/auth/verified/error=true&message=${message}`);
                 })
          } else{ // valid record exists => check user validation string
             bcrypt
             .compare(uniqueString, hashedUniqueString)
             .then(result =>{
                if(result){// strings match - update verified parameter in Users and delete respective Userverification record
                   Users
                   .updateOne({_id: userId}, {verified: true})
                   .then(()=>{
                     UserVerification
                     .deleteOne({userId})
                     .then(()=>{
                        res.sendFile(path.join(path.dirname(fileURLToPath(import.meta.url)), "../Views/verified.html"));
                     })
                     .catch(error =>{
                        console.log(error);
                        let message ="Error while updating verified parameter in Users model";
                        res.redirect(`/auth/verified/error=true&message=${message}`);
                    })
                   })
                   .catch(error =>{
                    console.log(error);
                    let message ="Error while updating verified parameter in Users model";
                    res.redirect(`/auth/verified/error=true&message=${message}`);
                   })
                }else{// incorrect details passed , buit the record exists
                   let message ="Invalid verification details passed !";
                   res.redirect(`/auth/verified/error=true&message=${message}`);
                }
             })
             .catch(error =>{
                let message ="Error happened while comparing new strings !";
                res.redirect(`/auth/verified/error=true&message=${message}`);
             })
          }
       }else {  // verification record is not exsisting
        let message ="Account record does not exist or has been verified already!";
        res.redirect(`/auth/verified/error=true&message=${message}`);
       }
     })
     .catch((error)=>{
        console.log(error);
        let message ="An error occured while checking the existance of user verification record !";
        res.redirect(`/auth/verified/error=true&message=${message}`);
     })
});

// verified page route
router.get("/verified", (req, res)=>{
   res.sendFile(path.join(__dirname,"./../Views/verified.html"));
});
 

export default router;