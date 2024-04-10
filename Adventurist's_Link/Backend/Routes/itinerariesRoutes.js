import express from "express";
import { protectRoute } from "../Middlewares/protectRoute.js";
import { addActivity, addDestinationToItinerary, addParticipant, createItinerary, deleteItinerary, editItineray, removeActivityFromItinerary, removeDestinationFromItinerary, removeParticipantFromItinerary } from "../Controllers/Itinerary.js";

const router = express.Router();

router.post("/",protectRoute,createItinerary);
router.patch("/:itineraryId",protectRoute,editItineray);
router.delete("/:itineraryId", protectRoute, deleteItinerary);
router.post("/:itineraryId/activities", protectRoute, addActivity);
router.delete("/:itineraryId/activities", protectRoute, removeActivityFromItinerary);
router.post("/:itineraryId/participants", protectRoute, addParticipant);
router.delete("/:itineraryId/participants", protectRoute, removeParticipantFromItinerary);
router.post("/:itineraryId/destinations", protectRoute, addDestinationToItinerary);
router.delete("/:itineraryId/destinations", protectRoute, removeDestinationFromItinerary);

export default router ;