import express from "express";
import { protectRoute } from "../Middlewares/protectRoute.js";
import { create_activity, delete_activity, edit_activity, getActivityById, getAllActivities } from "../Controllers/Activity.js";


const router = express.Router();

router.post("/",protectRoute,create_activity);
router.get("/",protectRoute,getAllActivities);
router.get("/:id",protectRoute,getActivityById);
router.put("/:id",protectRoute,edit_activity);
router.delete("/:id",protectRoute,delete_activity);

export default router;