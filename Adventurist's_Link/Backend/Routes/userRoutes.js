import express from "express";
import { protectRoute } from "../Middlewares/protectRoute.js";
import { editProfile, getUsersForSideBar } from "../Controllers/userProfile.js";

const router = express.Router();

router.get("/",protectRoute,getUsersForSideBar);
router.post("/update",protectRoute,editProfile);

export default router ;