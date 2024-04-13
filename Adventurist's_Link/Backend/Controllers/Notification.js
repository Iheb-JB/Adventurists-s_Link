import Notification from '../Models/Notification.js' ;

export const createNotification = async(req,res)=>{
    try {
        const{type , message,user} = req.body
        const notification = new Notification({
            type,
            message,
            user
        });
        await notification.save();
        res.status(200).json(notification);
        
    } catch (error) {
        console.log("Error in creating notification:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const markNotifAsRead = async(req,res)=>{
  try {
    const {notificationId} = req.params ;
    const notification = await Notification.findByIdAndUpdate(
        notificationId,
        {markAsRead: true},
        {new: true}
    );
    if(!notification){
        return res.status(404).json({message:"notification not found !"});
    }
    res.status(200).json(notification);
    
  } catch (error) {
      console.log("Error in reading notification:", error.message);
      res.status(500).json({ error: "Internal server error" });
  }
};