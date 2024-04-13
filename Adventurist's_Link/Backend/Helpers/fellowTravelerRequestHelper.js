import FellowTravelerRequest from "../Models/FellowTravelerRequest.js";
import Itinerary from "../Models/Itinerary.js";
import userProfile from "../Models/userProfile.js";
import { sendNotification } from "./notificationHelper.js";

export const sendFellowTravelerRequest = async(senderId,receiverId,itineraryId)=>{
      
    try {
        const sender = await userProfile.findById(senderId);
        const receiver = await userProfile.findById(receiverId);
        const itinerary = await Itinerary.findById(itineraryId);
        if (!sender || !receiver || !itinerary) {
            throw new Error("User, receiver, or itinerary not found.");
        }
        //check if there's already an existing request
        const existingRequest = await FellowTravelerRequest.findOne({
           sender: senderId,
           receiver: receiverId,
           itinerary: itineraryId
        });
        if(existingRequest){ throw new Error('A request has already been sent to this user regarding the same itinerary !');}
        
        const newRequest = new FellowTravelerRequest({
            sender: senderId,
            receiver: receiverId,
            itinerary: itineraryId,
            status: 'pending'
        });
        const savedRequest = await newRequest.save();
        //update user profiles requests array
        await userProfile.findByIdAndUpdate(receiverId,{
            $push: {fellowTravelerRequests: savedRequest._id}
        });
        await userProfile.findByIdAndUpdate(senderId,{
            $push: { fellowTravelerRequests: savedRequest._id}
        });

        //send notification to the receiver
        const notificationMessage = `${sender.username} has sent you a fellow traveler request for the itinerary ${itinerary.title}`;
        await sendNotification(receiverId,'FellowTravelerRequest', notificationMessage );

        return {success: true, message:'Your request has been sent , waiting for reply !'};
        
    } catch (error) {
        console.log("Failed to send fellow traveler request:", error.message);
        return { success: false , message: error.message};
    }
};