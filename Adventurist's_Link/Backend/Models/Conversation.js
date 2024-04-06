import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema({
  
      participants: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Users',
          required: true
        }
      ],
      messages: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Messages',
          default: [],
        }
      ]
});

export default mongoose.model("Conversations", ConversationSchema);

//export default mongoose.model("Users", UsersSchema);