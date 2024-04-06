import Conversations from "../Models/Conversation.js"
import Message from '../Models/Message.js'

export const sendMessage = async(req,res)=>{
    try{
       const {message} = req.body;
       const {id: receiverId}= req.params ;
       const senderId = req.user._id;

       let conversation = await  Conversations.findOne({
          particpants: {$all:[senderId, receiverId]},
       });
        // check if the conversation exists or its first time message
        if(!conversation){
            conversation = await Conversations.create({
                participants: [senderId, receiverId],
            })
        }
        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            content: message,
        })
        // send new message in the messages array
        if(newMessage){
            conversation.messages.push(newMessage._id)
        }
        // SOCKET IO FUNCTIONALITY TO BE ADDED 


        // save in parallel to ensure real-time updates in chat feature
        await Promise.all([conversation.save(),newMessage.save()]);
        res.status(201).json(newMessage);
       
    }catch(error){
       console.log("error in sending Message:" , error.message);
       res.status(500).json({error: "internal server error"});
    }
};

export const getMessages = async(req, res)=>{
   try{
     const {id: userToChatId}= req.params;
     const senderId = req.user._id;
     const conversation = await Conversations.findOne({
       participants:{$all:[senderId,userToChatId]},
     }).populate("messages");  //getting the messages objects  instead of just the reference (id) of the message
      if(!conversation) return res.status(200).json([]);

     res.status(200).json(conversation.messages);
   }catch(error){
    console.log("error in get Messages:" , error.message);
    res.status(500).json({error: "internal server error"});
   }

};