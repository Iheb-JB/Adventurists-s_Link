
import mongoose from "mongoose";

const DestinationSchema = new mongoose.Schema({

    id:{
      type: String,
      required: true,
      unique: true
    },
    name:{
       type: String,
       required: true
    },
    latitude: {
         type: Number,
         required: true
    },
    longitude: { 
      type: Number,
      required: true
    },
    itineraries: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Itinerary'
        }
    ],
});

export default mongoose.model("Destinations",DestinationSchema);