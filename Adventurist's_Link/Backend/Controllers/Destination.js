import Destination from "../Models/Destination.js";

export const createDestination = async(req,res)=>{
    const {name , coordinates}= req.body ;
    try {
        const newDestination = new Destination({
           name,
           location: {
            type: 'Point',
            coordinates,
          },
        });
        await newDestination.save();
        res.status(200).json(newDestination);
        
    } catch (error) {
      console.log("error in creating destination :" , error.message);
      res.status(500).json({error: "internal server error"});
    }
}

export const updateDestination = async(req,res)=>{
    const {id} = req.params ;
    const {name , coordinates} = req.body;
    try {
        const upddatedDestination = await Destination.findByIdAndUpdate(id,
            {name,
             location: {
                type: 'Point',
                coordinates, // Update with the new coordinates
              }},{new:true});
        res.status(200).json(upddatedDestination);
    } catch (error) {
      console.log("error in updating destination :" , error.message);
      res.status(500).json({error: "internal server error"});
    }
}

export const getAllDestinations = async(req,res)=>{
    try {
        const destinations = await Destination.find();
        res.status(200).json(destinations);
    } catch (error) {
      console.log("error in getting Alldestination :" , error.message);
      res.status(500).json({error: "internal server error"});
    }
}

export const deleteDestination = async(req,res)=>{
    const {id} = req.params ;
    try {
        await Destination.findByIdAndDelete(id);
        res.status(200).json({message: "Destination deleted !"});
    } catch (error) {
      console.log("error in deleting destination :" , error.message);
      res.status(500).json({error: "internal server error"});
    }
}

export const getDestinationById = async(req,res)=>{
    const {id} = req.params ;
    try {
        const destination = await Destination.findById(id);
        res.status(200).json(destination);
    } catch (error) {
      console.log("error in getting destination by ID :" , error.message);
      res.status(500).json({error: "internal server error"});
    }
}