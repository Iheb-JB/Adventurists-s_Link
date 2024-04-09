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
});

export default mongoose.model("Activities", ActivitySchema);