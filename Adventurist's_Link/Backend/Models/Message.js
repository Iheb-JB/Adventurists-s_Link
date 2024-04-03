const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    id: {
      type: String,
      required: true,
      unique: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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

module.exports = new mongoose.model("Messages", MessageSchema);