import express from "express";
import { createNotification, markNotifAsRead } from "../Controllers/Notification.js";
import { protectRoute } from "../Middlewares/protectRoute.js";

const router = express.Router();

router.post("/",protectRoute , createNotification);
router.put("/:notificationId",protectRoute, markNotifAsRead);

export default router;