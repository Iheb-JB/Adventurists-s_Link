import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  
      paticipants: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        }
      ],
      messages: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Message',
          default: [],
        }
      ]
});

module.exports = mongoose.model("Conversations", ConversationSchema);