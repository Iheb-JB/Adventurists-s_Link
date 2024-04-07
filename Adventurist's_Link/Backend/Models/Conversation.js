import { text } from "express";
import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  
      participants: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Users',
          required: true
        }
      ],
      
      lastMessage:{
         text: String,
         sender: {type: mongoose.Schema.Types.ObjectId,
          ref: 'Users',
        }
      },
},{timestamps: true});

export default mongoose.model("Conversations", ConversationSchema);

//export default mongoose.model("Users", UsersSchema);