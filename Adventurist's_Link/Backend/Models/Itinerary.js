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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'userProfile'
    },
    destination: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination'
    },
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