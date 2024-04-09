import Users from "../Models/Users.js";
import userProfile from "../Models/userProfile.js";

export const getUsersForSideBar = async(req,res)=>{
    try{
        const loggedInUserId = req.user._id ;
       const filteredUsers = await Users.findOne({_id: {$ne: loggedInUserId}}).select("-password"); // every user beside yourself as logged in 
        res.status(200).json(filteredUsers);

    }catch(error){
      console.log("error in get users for Sidebar :" , error.message);
      res.status(500).json({error: "internal server error"});
    }
}

export const editProfile = async(req,res)=>{
    try {
        //const {username, bio, profilePicture, travelerPreferences, identityVerified, accountStatus, gender, dateOfBirth } = req.body;
        const userId = req.user._id; // get the logged user ID
        //find user object to update
        const userProfileToUpdate = await userProfile.findOne({userId});
        if (!userProfileToUpdate) {
            return res.status(404).json({error: "User profile not found"});
          }
          // Extract fields from req.body
          const {
            username = userProfileToUpdate.username,
            bio = userProfileToUpdate.bio,
            profilePicture = userProfileToUpdate.profilePicture,
            travelerPreferences = userProfileToUpdate.travelerPreferences,
            identityVerified = userProfileToUpdate.identityVerified,
            accountStatus = userProfileToUpdate.accountStatus,
            gender = userProfileToUpdate.gender,
            dateOfBirth = userProfileToUpdate.dateOfBirth,
        } = req.body;
        // Update the user profile
       userProfileToUpdate.username = username;
       userProfileToUpdate.bio = bio;
       userProfileToUpdate.profilePicture= profilePicture;
       userProfileToUpdate.travelerPreferences = travelerPreferences;
       userProfileToUpdate.identityVerified = identityVerified;
       userProfileToUpdate.accountStatus = accountStatus;
       userProfileToUpdate.gender = gender;
       userProfileToUpdate.dateOfBirth = dateOfBirth;

       //save the updated user profile
       const updatedUserProfile = await userProfileToUpdate.save();

       res.status(200).json(updatedUserProfile);
        
    } catch (error) {
      console.log("error in editing user profile :" , error.message);
      res.status(500).json({error: "internal server error"});
    }
}