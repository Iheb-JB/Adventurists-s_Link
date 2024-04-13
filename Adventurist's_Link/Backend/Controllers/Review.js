import { sendNotification } from "../Helpers/notificationHelper.js";
import Itinerary from "../Models/Itinerary.js";
import Review from "../Models/Review.js";
import userProfile from "../Models/userProfile.js";


export const createReview = async(req,res)=>{
       const { itineraryId , username} = req.params;
       const { rating, content } = req.body;
       const reviewer = await userProfile.findById(req.userProfile._id);
    try {
    const itinerary = await Itinerary.findById(itineraryId).populate('participants');
    if (!itinerary) {
        return res.status(404).json({ message: "Itinerary not found" });
    }
    const reviewee = await userProfile.findOne({username});
    if (!reviewee) {
        return res.status(404).json({ message: "Reviewee not found" });
    }
    // check if both reviewer and reviwee shared an Itinerary together or no 
    const participantIds = itinerary.participants.map(participant =>participant._id.toString());
    if(!participantIds.includes(reviewer._id.toJSON())|| !participantIds.includes(reviewee._id.toString())) {
       return res.status(403).json({message: "You need to share the same itinerary with the reviewee if you want to make a review !"});
    }

    // check if this user has already been reviewed for the same itinerary
    const existingReview = await Review.findOne({
       user: reviewee._id,
       itinerary: itineraryId,
       reviewer: reviewer._id
    });
     if(existingReview){return res.status(400).json({message:`You have already rated this user for ${itinerary.title} itinerary !`});}
    // create the new review
    const review = new Review({
        rating,
        content,
        user: reviewee._id,
        reviewer: reviewer._id,
        itinerary: itinerary._id 
    });
    const savedreview = await review.save();
    // update review array for reviewee
    reviewee.reviews.push(savedreview);
    await reviewee.save();
    // Send a notification to the reviewee
    const notificationMessage = `You received a new review from ${reviewer.username} for itineray ${itinerary.title}`;
    sendNotification(reviewee._id ,'Review rating', notificationMessage );
    res.status(201).json(review);    
    } catch (error) {
        console.log("Error in creating review:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const editReview = async(req,res)=>{
    const { reviewId } = req.params;
    const { rating, content } = req.body;
    const reviewer = req.userProfile._id;
    try {
      const review = await Review.findById(reviewId);
      //console.log(review);
      if(!review){
        return res.status(404).json({message: 'Review not found !'});
      }
      //only reviewer can edit the review
      if(review.reviewer.toString() !== reviewer._id.toString()){
        return res.status(403).json({message: 'You can only edit your own review !'});
      }
      review.rating = rating ;
      review.content = content ;
      await review.save();
      
      // notify the reviewee for the review update
      const notificationMessage = `A review from ${req.userProfile.username} for the itinerary ${review.itinerary.title} has been updated.`;
      sendNotification(review.user, 'Review rating', notificationMessage);
      
    } catch (error) {
        console.log("Error in editing review:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const deleteReview = async(req,res)=>{
    const { reviewId } = req.params;
    const reviewer = req.userProfile._id ;
    try {
       const review = await Review.findById(reviewId);
       if (!review){return res.status(404).json({ message: "Review not found" });} 
       //only reviewer can delete the review
      if(review.reviewer.toString() !== reviewer._id.toString()){
        return res.status(403).json({message: 'You can only edit your own review !'});
      }
      await Review.deleteOne({_id: reviewId });
      // find the reviewee reviews itinerary and update it
       await userProfile.updateOne(review.user,{
         $pull: {reviews: review._id}
       });
       
       // notify the reviewee for the review update
      const notificationMessage = `A review from ${req.userProfile.username} for the itinerary ${review.itinerary.title} has been deleted.`;
      sendNotification(review.user, 'Review rating', notificationMessage);
      res.status(200).json({ message: "Review deleted successfully" }); 
    } catch (error) {
        console.log("Error in deleting review:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}