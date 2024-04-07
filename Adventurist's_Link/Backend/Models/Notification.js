import mongoose from "mongoose";


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
    default: false
   },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userProfile' 
  },
}, {timestamps: true});

module.exports = mongoose.model("Notifications", NotificationSchema);