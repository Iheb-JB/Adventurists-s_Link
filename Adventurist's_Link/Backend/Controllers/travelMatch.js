import { searchItineraries } from "../Helpers/search.js";

export const matchUsers = async(req,res)=>{
    const searchCriteria  = req.body;
    try {
        const userPreferences = req.userProfile.travelerPreferences ;
        const results = await searchItineraries(searchCriteria, userPreferences);
        res.json(results.map(result =>({
           itinerary: result.itinerary,
           matchscore: result.score
        })));
    } catch (error) {
        console.log("Error in matching users upon search:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}