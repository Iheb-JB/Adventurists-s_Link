import mongoose from "mongoose";


const NotificationSchema = new mongoose.Schema({

  type: { 
    type: String,
    required: true,
    enum:["FellowTravelerRequest","Review rating","Itinerary update","Message Notification"] 
  },
  message: {
    type: String,
    required: true
  },
  markAsRead: { 
    type: Boolean,
    default: false
   },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userProfile' 
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {timestamps: true});

export default mongoose.model("Notifications", NotificationSchema);