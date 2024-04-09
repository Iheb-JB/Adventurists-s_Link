import Activity from "../Models/Activity.js";
import Destination from "../Models/Destination.js";
import Itinerary from "../Models/Itinerary.js"


export const createItinerary = async(req,res)=>{
    const userId = req.userProfile._id; // get user ID of the creator 
    const{title , description , startDate , endDate ,destinationId , activitiesIds }=req.body
    try {
     // Check if the user is already a participant in the itinerary
      const isParticipant = await Itinerary.findOne({ participants: { $in: userId } });
      if (isParticipant) {
        return res.status(400).json({ error: "You are already a participant in this itinerary." });
    }
    const destination = await Destination.findById(destinationId);
        if (!destination) {
            return res.status(404).json({ error: "Destination not found." });
        }
    const activities = await Activity.find({ _id: { $in: activitiesIds } });
     if (activities.length!== activitiesIds.length) {
        return res.status(400).json({ error: "One or more activities not found." });
     }
     const itinerary = new Itinerary({
        title,
        description,
        startDate,
        endDate,
        user: userId,
        destination: destinationId,
        activities: activitiesIds, 
        participants: [userId] // Automatically add the creator as a participant
    });

    await itinerary.save();
    res.status(201).json(itinerary);
        
    } catch (error) {
        console.log("error in creating Itinerary:" , error.message);
       res.status(500).json({error: "internal server error"});
    }
}