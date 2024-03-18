import mongoose from "mongoose";

const FellowTravelerRequestSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
      },
      sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      receiver: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
      timestamp: {
        type: Date,
        required: true
      }
});

module.exports = mongoose.model("FellowTravelerRequests", FellowTravelerRequestSchema);