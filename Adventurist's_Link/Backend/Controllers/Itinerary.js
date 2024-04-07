

export const createItinerary = async(req,res)=>{
    try {
        
    } catch (error) {
        console.log("error in creating Itinerary:" , error.message);
       res.status(500).json({error: "internal server error"});
    }
}