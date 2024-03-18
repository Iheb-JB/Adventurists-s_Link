import mongoose from "mongoose";
import User from "./User.js";
import Destinations from "./Destination.js";

const ItinerarySchema = new mongoose.Schema({
  
    id:{
      type: String,
      required: true,
      unique: true
    },
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
      ref: 'User'
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
          ref: 'User'
        }
    ],
    reviews: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Review'
        }
    ],
});

module.exports = mongoose.model("Itineraries", ItinerarySchema);