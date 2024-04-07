import mongoose from 'mongoose';
import Users from './Users.js'; 

const userProfileSchema = new mongoose.Schema({
  // Reference to the Users model for authentication details
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
    unique: true 
  },
  username: {
    type: String,
    required: true
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
     required: true,
     default: false,
    },
  accountStatus: { 
    type: String,
    required: true 
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },
    dateOfBirth: {
      type: Date,
      required: true,
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

export default mongoose.model('userProfile', userProfileSchema);