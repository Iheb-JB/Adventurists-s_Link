import { sendNotification } from "../Helpers/notificationHelper.js";
import FellowTravelerRequest from "../Models/FellowTravelerRequest.js";
import Users from "../Models/Users.js";
import userProfile from "../Models/userProfile.js";

export const getUsersForSideBar = async(req,res)=>{
    try{
        const loggedInUserId = req.user._id ;
       const filteredUsers = await userProfile.find({userId: {$ne: loggedInUserId}}).populate({path: 'userId',
                                                                                               select: 'username profilePicture'}); // every user beside yourself as logged in 
        res.status(200).json(filteredUsers);

    }catch(error){
      console.log("error in get users for Sidebar :" , error.message);
      res.status(500).json({error: "internal server error"});
    }
}

export const editProfile = async(req,res)=>{
     const {userId ,username, bio, profilePicture, travelerPreferences, identityVerified, accountStatus, gender, dateOfBirth } = req.body;
        
    try {
        const userId = req.user._id; // get the logged user ID
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`
        //find user object to update
        let userProfileToUpdate = await userProfile.findOne({userId});
        if (!userProfileToUpdate) {   
          userProfileToUpdate = new userProfile({ // create the user Profile since it does not exist
             userId,
             username: `${req.user.firstName}_${req.user.lastName}`,
             bio: bio || "",
             profilePicture: gender ==="male" ? boyProfilePic : girlProfilePic || "",
             travelerPreferences: travelerPreferences || [],
             identityVerified : identityVerified || false,
             accountStatus : accountStatus || "active",
             gender: gender || "" , 
             dateOfBirth: dateOfBirth || new Date(),
          });
          await userProfileToUpdate.save();
          } else {
           
          // Update the user profile with new data or fallback to existing
          userProfileToUpdate.username = username;
          userProfileToUpdate.bio = bio ;
          userProfileToUpdate.profilePicture = profilePicture;
          userProfileToUpdate.travelerPreferences = travelerPreferences;
          userProfileToUpdate.identityVerified = identityVerified;
          userProfileToUpdate.accountStatus = accountStatus ;
          userProfileToUpdate.gender = gender;
          userProfileToUpdate.dateOfBirth = dateOfBirth;

       //save the updated user profile
       const updatedUserProfile = await userProfileToUpdate.save();

       res.status(200).json(updatedUserProfile);
        
      }
          
    } catch (error) {
      console.log("error in editing user profile :" , error.message);
      res.status(500).json({error: "internal server error"});
    }
};

export const updateFellowTravelerRequest = async(req,res)=>{
  const {requestId} = req.params;
  const {status} = req.body ;
  const userId = req.userProfile._id;
  try {
    const request = await FellowTravelerRequest.findById(requestId);
    if(!request){ return res.status(404).json({message: 'Fellow traveler request not found.'});}
    // only the receive can update the request
    if(request.receiver.toString() !== userId.toString()){
       return res.status(400).json({message: 'You can only reply to requests sent to your profile .'});
    }
    //validate the request status
    if(!['accepted','rejected'].includes(status)){
      return res.status(400).json({message: 'Invalid request status -Only accepted or rejected are allowed !'});
    }
    request.status = status ;
    await request.save();
    // send notificatio  to the sender about the update
    const sender = await userProfile.findById(request.sender);
    const receiver = await userProfile.findOne(userId);
    const notificationMessage = `Your fellow traveler request to ${receiver.username} for the itinerary has been ${status}`;
    await sendNotification(sender._id,'FellowTravelerRequest',notificationMessage );

    res.status(200).json({message:`Request has been ${status}`});
  } catch (error) {
    console.log("error in uppdating fellow traveler request:" , error.message);
    res.status(500).json({error: "internal server error"});
  }

}