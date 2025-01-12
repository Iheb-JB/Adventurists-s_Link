import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true
    },
    content: {
       type: String,
       required: true
    },
    attachments: [
        {
          filename: {
            type: String,
            required: true
          },
          path: {
            type: String,
            required: true
          },
          timestamp: {
            type: Date,
            required: true
          }
        }
    ],
}, {timestamps: true});

export default mongoose.model("Messages", MessageSchema);
