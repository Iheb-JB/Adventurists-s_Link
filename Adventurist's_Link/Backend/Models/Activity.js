import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  name: {
     type: String,
     required: true 
  },
  description: {
     type: String 
  },
  activityDate: { 
   type: Date,
   required: true
  },
  location: {
   type: {
     type: String, // GeoJSON type
     enum: ['Point'], 
     
   },
   coordinates: {
     type: [Number], // [longitude, latitude]
     
   }
 },
  type: { 
   type: String,enum: ["Cultural and city Exploration","Food and Culinary Experience","Adventure and Outdoor Activities","Relaxation and Wellness", "Party , Festivals and Events", "Other",""], 
   
 },
 groupSize:{
   type: Number,
   default:1 
 },
});

export default mongoose.model("Activities", ActivitySchema);