import { text } from "express";
import Conversations from "../Models/Conversation.js"
import Message from '../Models/Message.js'
import Conversation from "../Models/Conversation.js";
import userProfile from "../Models/userProfile.js";
import { sendNotification } from "../Helpers/notificationHelper.js";

export const sendMessage = async(req,res)=>{
    try{
       const {message} = req.body;
       const {id: receiverId}= req.params ;
       const senderId = req.userProfile._id;

       //console.log("Sender ID:", senderId, "Receiver ID:", receiverId);
       let conversation = await  Conversations.findOne({
          participants: {$all:[senderId,receiverId]},
       });
        // check if it's first time message create new conversation
        if(!conversation){
            conversation = await Conversations.create({
                participants: [senderId, receiverId],
                lastMessage: {
                    text: message,
                    sender: senderId    
                }
            })
            await conversation.save();
        }
        const newMessage = new Message({
            conversationId: conversation._id,
            senderId: senderId,
            //receiverId: receiverId,
            content: message,
        })
        // SOCKET IO FUNCTIONALITY TO BE ADDED 
        // save in parallel to ensure real-time updates in chat feature
        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage:{
                    text: message,
                    sender: senderId,
                }
            })
        ]);
        // Send a notification to the receiver
        const senderProfile = await userProfile.findById(senderId).select("username profilePicture");  // Assuming we have username and profilePicture
        const notificationMessage = `${senderProfile.username} sent you a message: "${message}"`;
        sendNotification(receiverId, 'Message Notification', notificationMessage);
        res.status(201).json(newMessage);
       
    }catch(error){
       console.log("error in sending Message:" , error.message);
       res.status(500).json({error: "internal server error"});
    }
};

export const getMessages = async(req, res)=>{
   try{
     const {id: userToChatId}= req.params;
     const senderId = req.userProfile._id;
     const conversation = await Conversations.findOne({
       participants:{$all:[senderId,userToChatId]},
     }); 
      if(!conversation){
        return res.status(404).json({error:"Conversation not found!"});
      } 
     const messages = await Message.find({
        conversationId: conversation._id
     }).sort({createdAt: 1});

     res.status(200).json(messages);
   }catch(error){
    console.log("error in get Messages:" , error.message);
    res.status(500).json({error: "internal server error"});
   }

};

export const getConversations = async(req,res)=>{
    const userId = req.userProfile._id;
    try{
        const conversations = await Conversation.find({participants: userId}).populate({
            path:"participants",
            select: "username profilePicture",
        });
        // remove the founded user from participants array
		conversations.forEach((conversation) => {
			conversation.participants = conversation.participants.filter(
				(participant) => participant._id.toString() !== userId.toString()
			);
		});

        // send response
        res.status(200).json(conversations);
    }catch(error){
      console.log("error in getting Conversations:" , error.message);
      res.status(500).json({error: "internal server error"});
    }
   
};