import express, { Router } from "express";
import { protectRoute } from "../Middlewares/protectRoute.js";
import { createReview, deleteReview, editReview } from "../Controllers/Review.js";


const router = express.Router();

router.post("/:itineraryId/:username",protectRoute, createReview);
router.put("/:reviewId",protectRoute,editReview);
router.delete("/:reviewId",protectRoute,deleteReview);

export default router;