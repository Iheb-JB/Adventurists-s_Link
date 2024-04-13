
import Notification from '../Models/Notification.js';
import userProfile from '../Models/userProfile.js';

export const sendNotification = async (userId, type, message) => {
    try {
        const notification = new Notification({
            user: userId,
            type,
            message
        });

        const savedNotification = await notification.save();
        //update the userProfile to include this notifications ID 
        await userProfile.findByIdAndUpdate(userId,{
            $push: {notifications: savedNotification._id}
        });
        console.log("Notification sent successfully.");
    } catch (error) {
        console.log("Failed to send notification:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
