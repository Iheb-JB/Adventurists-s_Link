import express from "express";
import { getConversations, getMessages, sendMessage } from "../Controllers/Message.js";
import {protectRoute} from "../Middlewares/protectRoute.js";



const router = express.Router();
router.get("/conversations",protectRoute,getConversations);
router.get("/:id",protectRoute,getMessages);

router.post("/send/:id",protectRoute,sendMessage);

export default router;