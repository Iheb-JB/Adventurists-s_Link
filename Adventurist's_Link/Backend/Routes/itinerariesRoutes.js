import express from "express";
import { protectRoute } from "../Middlewares/protectRoute.js";
import { createItinerary } from "../Controllers/Itinerary.js";

const router = express.Router();

router.post("/",protectRoute,createItinerary);

export default router ;