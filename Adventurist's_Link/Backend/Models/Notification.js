import mongoose from "mongoose";
import User from "./User.js";

const NotificationSchema = new mongoose.Schema({
  
  id: {
    type: String,
    required: true,
    unique: true 
  },
  type: { 
    type: String,
    required: true,
    enum:["FellowTravelerRequest","Review Rating","General"] 
  },
  message: {
    type: String,
    required: true
  },
  read: { 
    type: Boolean,
    default: false },
  timestamp: { 
    type: Date, 
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  },
});

module.exports = mongoose.model("Notifications", NotificationSchema);