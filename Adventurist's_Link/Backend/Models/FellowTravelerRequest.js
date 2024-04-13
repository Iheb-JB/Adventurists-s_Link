import mongoose from "mongoose";

const FellowTravelerRequestSchema = new mongoose.Schema({
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userProfile',
        required: true
      },
      receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userProfile',
        required: true
      },
      itinerary: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Itineraries',
        required: true
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
      },
},{timestamps:true});

export default mongoose.model("FellowTravelerRequests", FellowTravelerRequestSchema);