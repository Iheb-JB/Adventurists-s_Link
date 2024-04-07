import mongoose from "mongoose";

const FellowTravelerRequestSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
      },
      sender: {
        type: Schema.Types.ObjectId,
        ref: 'userProfile',
        required: true
      },
      receiver: {
        type: Schema.Types.ObjectId,
        ref: 'userProfile',
        required: true
      },
      itinerary: {
        type: Schema.Types.ObjectId,
        ref: 'Itineraries',
        required: true
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
      },
},{timestamps:true});

module.exports = mongoose.model("FellowTravelerRequests", FellowTravelerRequestSchema);