
import mongoose from "mongoose";

const DestinationSchema = new mongoose.Schema({

    name:{
       type: String,
       required: true
    },
    location: {
      type: {
        type: String, // GeoJSON type
        enum: ['Point'], 
        required: true
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true
      }
    },
    itineraries: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Itinerary'
        }
    ],
});

// Geospatial index for querying by location
DestinationSchema.index({ location: '2dsphere' });

export default mongoose.model("Destinations",DestinationSchema);