import mongoose from "mongoose";
import User from "./User.js";

const ReviewSchema = new mongoose.Schema({
  id: { 
    type: String,
    required: true,
    unique: true 
  },
  rating: {
    type: Number,
    required: true
  },
  content: { 
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' },
});

module.exports = mongoose.model('Reviews', ReviewSchema);