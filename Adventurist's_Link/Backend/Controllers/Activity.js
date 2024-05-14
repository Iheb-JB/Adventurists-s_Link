import Activity from "../Models/Activity.js";

export const create_activity = async (req, res) => {
  try {
    const { name, location, activityDate ,groupSize, description, type } = req.body;
    // Create a new activity
    const newActivity = new Activity({
      name,
      location,
      activityDate,
      groupSize,
      description,
      type
    });
    const savedActivity = await newActivity.save();
    res.status(201).json({ message: "Activity created successfully", activity: savedActivity });
  } catch (error) {
    console.log("Error in creating Activity:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const edit_activity = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, location, activityDate ,groupSize, description, type } = req.body;
  
      // Find the activity
      const activityToUpdate = await Activity.findById(id);
  
      // Update the activity
      activityToUpdate.name = name;
      activityToUpdate.location = location;
      activityToUpdate.activityDate = activityDate;
      activityToUpdate.groupSize = groupSize; 
      activityToUpdate.description = description;
      activityToUpdate.type = type;
  
      // Save the updated activity
      const updatedActivity = await activityToUpdate.save();
  
      // Send the response
      res.status(200).json({ message: "Activity updated successfully", activity: updatedActivity });
    } catch (error) {
      console.log("Error in updating Activity:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const delete_activity = async (req, res) => {
    try {
      const { id } = req.params;
      // Delete 
      await Activity.findByIdAndDelete(id);
      res.status(200).json({ message: "Activity deleted successfully" });
    } catch (error) {
      console.log("Error in deleting Activity:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const getAllActivities = async (req, res) => {
    try {
      // Retrieve all activities
      const activities = await Activity.find();
      res.status(200).json(activities);
    } catch (error) {
      console.log("Error in getting all activities:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  export const getActivityById = async (req, res) => {
    try {
      const { id } = req.params;
      // Retrieve the activity by ID
      const activity = await Activity.findById(id);
      res.status(200).json(activity);
    } catch (error) {
      console.log("Error in getting activity by ID:", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };