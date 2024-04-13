import mongoose from "mongoose";


const ReviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  content: { 
    type: String,
    required: true
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userProfile'
   },
   reviewer: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userProfile'
   },
   itinerary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Itinerary",
  },
}, {timestamps:true});

export default mongoose.model('Reviews', ReviewSchema);