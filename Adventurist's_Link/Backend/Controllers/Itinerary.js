import { sendNotification } from "../Helpers/notificationHelper.js";
import Activity from "../Models/Activity.js";
import Destination from "../Models/Destination.js";
import Itinerary from "../Models/Itinerary.js"
import userProfile from "../Models/userProfile.js";


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
        destinations: destinationId,
        activities: activitiesIds, 
        participants: [userId] // Automatically add the creator as a participant
    });

    await itinerary.save();
    //update the creatpr userProfile document
    const creator = await userProfile.findById(userId);
    if(!creator){
        return res.status(404).json({error: "User not found !"});
    }
    creator.itineraries.push(itinerary._id);
    await creator.save(); // save the updated user profile
    sendNotification(userId,'Itinerary Update','A new itinerary has been created'); // send notification about itinerary creation
    res.status(201).json(itinerary);
        
    } catch (error) {
        console.log("error in creating Itinerary:" , error.message);
       res.status(500).json({error: "internal server error"});
    }
}

export const editItineray = async(req,res)=>{
    const {itineraryId} = req.params ;
    const updates = req.body ;
    try {
        const itinerary = await Itinerary.findById(itineraryId);
        if(!itinerary){
            return res.status(400).json({error: "Itineray not found ! Please try again"});
        }

        // allow only creator of Itinerary to update
        if(itinerary.user.toString()!== req.userProfile._id.toString()){
            return res.status(403).json({error:"You do not have permission to edit this itinerary."});
        }
        //dynamic assignments of attributes
        Object.keys(updates).forEach((key)=>{
           itinerary[key]= updates[key];
        });
        await itinerary.save();
        itinerary.participants.forEach(participant =>{
            sendNotification(participant._id, 'Itinerary update',` Your itinerary ${itinerary.title} have been updated .`);
         });
        res.status(200).json(itinerary);
    } catch (error) {
        console.log("error in updating Itinerary:" , error.message);
       res.status(500).json({error: "internal server error"});
    }
}

export const deleteItinerary = async(req,res)=>{
     const {itineraryId} = req.params;
     try {
        const itinerary = await Itinerary.findById(itineraryId);
        if(!itinerary){
            return res.status(400).json({error: "Itineray not found ! Please try again"});
        }
        // allow only creator of Itinerary to delete
        if(itinerary.user.toString()!== req.userProfile._id.toString()){
            return res.status(403).json({error:"You do not have permission to delete this itinerary."});
        }
        await itinerary.deleteOne({_id: itineraryId});
        sendNotification(itinerary.user,'Itinerary update',`Your ${itinerary.title} itinerary has been deleted `);
        res.status(200).json({message: "Itinerary deleted successfully !"});

     } catch (error) {
       console.log("error in deleting Itinerary:" , error.message);
       res.status(500).json({error: "internal server error"});
     }
}

export const addActivity = async(req,res)=>{
    const {itineraryId} = req.params;
    const {activityId} = req.body ;
    try {
        const itinerary = await Itinerary.findById(itineraryId);
        const activity = await Activity.findById(activityId);
        if(!itinerary || !activity){
            return res.status(404).json({error:"Itinerary or Activity not found !"});
        }
        // check if activity exists already in the activities array
        if(!itinerary.activities.includes(activityId)){
            itinerary.activities.push(activityId);
            await itinerary.save();
            //notify all participants about the new activity
            itinerary.participants.forEach(participant =>{
               sendNotification(participant._id, 'Itinerary update',`A new activity have been added to your itinerary ${itinerary.title}`);
            });
        }
        res.status(200).json(itinerary);
        
    } catch (error) {
       console.log("error in addining activity to Itinerary Itinerary:" , error.message);
       res.status(500).json({error: "internal server error"});
    }
}

export const removeActivityFromItinerary = async (req, res) => {
    const { itineraryId } = req.params;
    const { activityId } = req.body;

    try {
        const itinerary = await Itinerary.findById(itineraryId);
        const activity = await Activity.findById(activityId);

        if (!itinerary) {
            return res.status(404).json({ error: "Itinerary not found." });
        }

        itinerary.activities = itinerary.activities.filter((id) => id.toString() !== activityId);
        await itinerary.save();
        //notify all participants about the deleted activity
        itinerary.participants.forEach(participant =>{
            sendNotification(participant._id, 'Itinerary update',`Activity ${activity.name} have been deleted from your itinerary ${itinerary.title}`);
         });

        res.status(200).json(itinerary);
    } catch (error) {
        console.log("Error in removing Activity from Itinerary:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const addParticipant = async(req,res)=>{
    const {itineraryId} = req.params;
    const {username} = req.body ;
    try {
        const itinerary = await Itinerary.findById(itineraryId);
        const newParticipant = await userProfile.findOne({username});
        if(!itinerary || !newParticipant){
            return res.status(404).json({error:"Itinerary or Participant not found !"});
        }
        // check if participant exists already in the participants array
        if(itinerary.participants.includes(newParticipant._id)){
            return res.status(409).json({message: "Participant already added to this Itinerary !"});
        }
        itinerary.participants.push(newParticipant._id);
        newParticipant.itineraries.push(itineraryId);
        await Promise.all([itinerary.save(), newParticipant.save()]);
        // sending notifications about the Itinerary change to concerned user and remaining users
        sendNotification(newParticipant._id,'Itinerary update',`You have been added to Itinerary ${itinerary.title}`);
        itinerary.participants.forEach(participant =>{
           if(participant._id.toString() !== newParticipant._id.toString()){
             sendNotification(participant._id,'Itinerary update',`${newParticipant.username} have been added Itinerary ${itinerary.title}`);
           }
        });
        
        res.status(200).json({message: "Participant added successfully /n",itinerary});
        
    } catch (error) {
       console.log("error in adding to participant Itinerary:" , error.message);
       res.status(500).json({error: "internal server error"});
    }
};

export const removeParticipantFromItinerary = async (req, res) => {
    const { itineraryId } = req.params;
    const { username } = req.body;

    try {
        const itinerary = await Itinerary.findById(itineraryId);
        const participantToRemove = await userProfile.findOne({username});

        if (!itinerary || !participantToRemove) {
            return res.status(404).json({ error: "Itinerary or participant not found." });
        }

        itinerary.participants = itinerary.participants.filter((id) => id.toString() !== participantToRemove._id.toString());
        await itinerary.save();
        //delet the itinerary from the particpant itineraries array 
        participantToRemove.itineraries = participantToRemove.itineraries.filter(id => id.toString()!== itineraryId);
        await participantToRemove.save();
        // sending notification to the romved participant
        sendNotification(participantToRemove._id,'Itinerary update',`You have been removed from Itinerary ${itinerary.title}`);
        //notify remianing participants
        itinerary.participants.forEach(participant =>{
            sendNotification(participant._id, 'Itinerary Update',`${participantToRemove.username} has been removed from your Itinerary ${itinerary.title}`);
        });
        res.status(200).json(itinerary);
    } catch (error) {
        console.log("Error in removing participant from Itinerary:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const addDestinationToItinerary = async (req, res) => {
    const { itineraryId } = req.params;
    const { destinationId } = req.body;

    try {
        const itinerary = await Itinerary.findById(itineraryId);
        const destination = await Destination.findById(destinationId);

        if (!itinerary || !destination) {
            return res.status(404).json({ error: "Itinerary or destinatiom not found." });
        }
        // Prevent adding the same destination more than once
        if (!itinerary.destinations.includes(destinationId)) {
            itinerary.destinations.push(destinationId);
            destination.itineraries.push(itineraryId);
            //console.log(testDest);
            await Promise.all([itinerary.save(), destination.save()]);
            // Notify all participants about the new destination
            itinerary.participants.forEach(participant => {
                sendNotification(participant._id, 'Itinerary Update', `A new destination ${destination.name} has been added to your itinerary ${itinerary.title}.`);
            });
            res.status(200).json({ message: "Destination added successfully.", itinerary });
        } else {
            res.status(409).json({ message: "Destination already added to the itinerary." });
        }
    } catch (error) {
        console.log("Error in adding destination to itinerary:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const removeDestinationFromItinerary = async (req, res) => {
    const { itineraryId } = req.params;
    const { destinationId } = req.body;

    try {
        const itinerary = await Itinerary.findById(itineraryId);

        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found." });
        }

        itinerary.destinations = itinerary.destinations.filter(id => id.toString() !== destinationId);
        await itinerary.save();

        // Notify all participants about the destination removal
        itinerary.participants.forEach(participant => {
            sendNotification(participant._id, 'Itinerary Update', `A destination has been removed from your itinerary ${itinerary.title}.`);
        });

        res.status(200).json({ message: "Destination removed successfully.", itinerary });
    } catch (error) {
        console.log("Error in removing destination from itinerary:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

