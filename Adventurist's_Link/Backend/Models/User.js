import mongoose from 'mongoose';
import Users from './Users.js'; 

const UserSchema = new mongoose.Schema({
  id: { 
    type: String,
    required: true,
    unique: true 
    },
  profilePicture:{
     type: String,
     default: "",
    },
  bio: { 
    type: String,
    required: true 
    },
  travelerPreferences: { 
    type: String,
    required: false ,
    enum: ["Cultural and city Exploration","Food and Culinary Experience","Adventure and Outdoor Activities (hiking, biking, etc.)","Relaxation and Wellness", "Party , Festivals and Events"],
    },
  identityVerified: {
     type: Boolean,
     required: true 
    },
  accountStatus: { 
    type: String,
    required: true 
    },
  //reference relationships that define one-to-many relationships between models
  itineraries: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Itinerary'
    }
  ],
  conversations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation'
    }
  ],
  fellowTravelerRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FellowTravelerRequest'
    }
  ],
  notifications: [
    { type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification'
    }
  ],
  reviews: [
    { type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
  ],
  travelMatches: [
    { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TravelMatch'
    }
  ]
    // created at / updated at => Member since <createdAt>
},{timestamps: true});

export default mongoose.model('User', UserSchema);