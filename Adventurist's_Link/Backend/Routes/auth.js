import express from "express";
import isAdmin from "../Middlewares/isAdmin.js";
import  isLoggedIn from "../Middlewares/isLoggedIn.js";
import { registerUser, login , logout} from "../Controllers/Users.js";



const router = express.Router();
router.post("/signup", registerUser);
router.post("/login" , login);
router.post("/logout" , logout);
 

export default router;