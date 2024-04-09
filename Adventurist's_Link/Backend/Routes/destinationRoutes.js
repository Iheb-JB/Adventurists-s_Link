import express from "express";
import { protectRoute } from "../Middlewares/protectRoute.js";
import { createDestination, deleteDestination, getAllDestinations, getDestinationById, updateDestination } from "../Controllers/Destination.js";

const router = express.Router();

router.post("/",protectRoute,createDestination);
router.get("/",protectRoute,getAllDestinations);
router.get("/:id",protectRoute,getDestinationById);
router.put("/:id",protectRoute,updateDestination);
router.delete("/:id",protectRoute,deleteDestination);

export default router;