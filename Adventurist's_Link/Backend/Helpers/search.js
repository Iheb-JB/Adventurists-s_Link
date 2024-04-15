import Destination from "../Models/Destination.js";
import Itinerary from "../Models/Itinerary.js";


export const searchItineraries = async(searchCriteria , userPreferences)=>{
    const { searchString} = searchCriteria ;
   // console.log("Search String:", searchString); 
    try{
      //find query to find destinations 
    const destinations = await Destination.find({
        name:{$regex: searchString , $options: 'i'} // case insensitive partial match
    });
    if(!destinations.length){
        console.log("No destinations found within the specified range.");
            return [];
    }

    // find itineraries that includes this destinations 
    const itineraries = await Itinerary.find({
        destinations: {$in: destinations.map(dest => dest._id)}
    }).populate('participants').populate({
        path: 'activities',
        model: 'Activities'
    });

    // score itineraries for matching algorithm
    const scoredItineraries = itineraries.map(itinerary =>{
        let score = 0 ;
        let totalParticipants = itinerary.participants.length;
        // score based on matching participants preferences
        itinerary.participants.forEach(participant=>{
            let matchCount = participant.travelerPreferences.reduce((count,pref) =>
                userPreferences.includes(pref) ? count +1: count, 0 );
            score += (matchCount / participant.travelerPreferences.length)* 100 ;
        });
        //score based on matching activity steps 
        itinerary.activities.forEach(activity =>{
            if(userPreferences.includes(activity.type)){score += 10 ;}// each mached activity adds points
        });
        score = score / totalParticipants ;
        return {itinerary , score};
    });

    scoredItineraries.sort((a,b)=> b.score - a.score);
    return scoredItineraries ;
    }catch(error){
        console.error("Failed to search with search criteria:", error);
        throw error;
    }
    
};