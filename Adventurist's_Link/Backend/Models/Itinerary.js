import mongoose from "mongoose";

const ItinerarySchema = new mongoose.Schema({
    title:{
      type: String,
      required: true
    },
    description:{
      type: String
    },
    startDate: { 
      type: Date,
      required: true
    },
    endDate: { 
      type: Date,
      required: true
    },
    groupSize:{
      type: Number,
      default:1 
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userProfile'
    },
    destinations: [{ 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination'
    }],
    activities: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Activity' 
        }
    ],
    participants: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'userProfile'
        }
    ],
    reviews: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Review'
        }
    ],
});

 export default mongoose.model("Itineraries", ItinerarySchema);