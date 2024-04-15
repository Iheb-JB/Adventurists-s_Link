import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  name: {
     type: String,
     required: true 
  },
  description: {
     type: String 
  },
  duration: {
     type: Number,
     required: true 
  },
  type: { 
   type: String,
   enum: ["Cultural and city Exploration","Food and Culinary Experience","Adventure and Outdoor Activities","Relaxation and Wellness", "Party , Festivals and Events", "Other"], 
 }
});

export default mongoose.model("Activities", ActivitySchema);