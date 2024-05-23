import Destination from "../Models/Destination.js";
import Itinerary from "../Models/Itinerary.js";


export const searchItineraries = async(searchCriteria , userPreferences)=>{
    const { searchString,
            startDate,
            endDate,
            type,
            location
    } = searchCriteria ; 
     const dateFlexibility = 7; // days of flexibility around start and end dates
    try{
    // query to search for destinations : name + location using GOOGLE MAP API object
    let destinationQuery = {
       name: {$regex: searchString, $options:'i'}
    };
    if(location && location.coordinates){
        destinationQuery={
            ...destinationQuery,
            location:{
                $near:{
                    $geometry:{
                        type: 'Point',
                        coordinates: location.coordinates
                    },
                    $maxDistance: 200000 // up to 200Km near
                }
            }
        };
    }
    const destinations = await Destination.find(destinationQuery);
    if(!destinations.length){
        console.log("No created Itineraries found with this destination.");
        return [];
    }
    //seetting flexible dates for search:
    const flexibleStartDate = new Date(startDate);
    flexibleStartDate.setDate(flexibleStartDate.getDate()-dateFlexibility);
    const flexibleEndDate = new Date(endDate);
    flexibleEndDate.setDate(flexibleEndDate.getDate()+ dateFlexibility);
    // find itineraries that includes the searched destinations within the set flexible dates
    const itineraries = await Itinerary.find({
        destinations: {$in: destinations.map(dest => dest._id)},
        $or: [
            { startDate:{$gte:flexibleStartDate, $lte:flexibleEndDate}},
            {endDate:{$gte:flexibleStartDate, $lte:flexibleEndDate}}
        ],
    }).populate('participants').populate({
        path: 'activities',
        model: 'Activities'
    });
    // score the founded itineraries to sort them out
    const scoredItineraries = itineraries.map(itinerary =>{
        let score = 0 ;
        let totalParticipants = itinerary.participants.length;
        // score based on matching participants preferences
        itinerary.participants.forEach(participant=>{
            let matchCount = participant.travelerPreferences.reduce((count,pref) =>
                userPreferences.includes(pref) ? count +1: count, 0 );
            score += (matchCount / participant.travelerPreferences.length)* 100 ;
        });
        //score based on matching activity type 
        itinerary.activities.forEach(activity =>{
            if(userPreferences.includes(activity.type)){score += 5 ;}// each matched activity adds points
            if(type === activity.type){// if activity type matches the type chosen by the user in the search bar
               score +=15 ; 
            }
        });
        score = score / totalParticipants ;
        console.log('Matching score',score);
        return {itinerary , score};
    });
    scoredItineraries.sort((a,b)=> b.score - a.score);
    return scoredItineraries ; // an array of sorted results (itineraries) based on the matching score
    }catch(error){
        console.error("Failed to search with search criteria:", error);
        throw error;
    }  
};