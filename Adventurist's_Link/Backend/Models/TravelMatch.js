import mongoose from "mongoose";
import User from "./User.js";

const TravelMatchSchema = new mongoose.Schema({
    user1: { type: mongoose.Schema.Types.ObjectId, ref: 'userProfile' },
    user2: { type: mongoose.Schema.Types.ObjectId, ref: 'userProfile' },
    match_score:{
       type : Number,
    },
    match_status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
      },
    itinerary: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' }
  });

  module.exports = mongoose.model('TravelMatch', TravelMatchSchema);