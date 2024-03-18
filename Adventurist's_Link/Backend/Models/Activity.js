import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  
  id: {
     type: String,
     required: true,
     unique: true 
  },
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
});

export default mongoose.Schema("Activities", ActivitySchema)