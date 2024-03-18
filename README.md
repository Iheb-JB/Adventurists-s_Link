# Adventurists-s_Link

Title :  Adventurist Link Web Application 
Our innovative cloud based web application redefines the solo travel experience by connecting them 
with companions heading to the same destination , fostering shared journeys and unforgettable 
memories . Through a pioneering matching algorithm , our application empowers users(travelers) to 
enhance their adventure experience ,forge bonds with fellow explorers and tap into the expertise of 
locals. All of this is wrapped within an intuitive user experience creating a gateway of a world of 
exciting possibilities. 
Tasks to be performed by the student will include: 
• User profiles and Preferences: Create personalized profiles with travel interests, destinations 
and bio information to better connect with potential travel buddies . 
• Traveler Matching Algorithm: Smart algorithm matches solo travelers based on  
shared travel destinations , preferences and interests . 
• Secure Messaging Platform : Provide the potential to communicate with potential  
travel buddies and locals through a messaging system making planning the trip and  
coordination effortless . 
• User Identification Verification: Implement a robust authentication system and  
strong terms of use for the application to ensure users verification. 
• User Reviews and Ratings: leave and read reviews and ratings to build a trustworthy  
community and to help users make informed decisions for their journey. 
• Geolocation Integration : discover nearby locals, attractions, and recommended  
points of interest to help enhancing the travel itinerary.


# Use case Description : 
1- Authentication 
Actors : Traveler
Use cases : + Register new account
            + Login
Possible Scenarios : 1 Verify email address ( confirm within the confirmation email)
                     2 AgreeTo privacy Policy
                     3 Submit Identity documents to be reviewed by app admin before the account get activated.
                     4 User forgot password.

2-Manage Profiles : 
Actors : Traveler
Use cases : + edit\add\delete profile informations 
            + edit\add\delete interests and preferences
            +delete account 
Possible Scenarios : 1 upload profile picture with conforming size and pixels.
                     2 fill at least the mandatory fields in his\her profile
                     3 Select interests and activities that a user wants with priority (example 1 food 2 nightlife etc...)

3-Manage Travels : 
Actors : Traveler
Use cases : + Set your status as going on selected destinations . 
            +  Search for destinations
            +  Apply filters to the original search (actvities , preferences matching , duration...)
            +  Create/Save Itineraries
            +  edit\add\delete itinerary details and participants and statuses

Possible Scenarios : 1 upload profile picture with conforming size and pixels.
                     2 fill at least the mandatory fields in his\her profile
                     3 Select interests and activities that a user wants with priority (example 1 food 2 nightlife 
                     4 When searching for destinations , you can select created itineraries posted to that      destinations or see other travlers who are going there  

4-Manage FellowTravelers : 
Actors : Traveler
Use cases : +  Check suggested fellowtravelers based on the filters chosen(stated in previous use case)
            +  Manage fellowtarvelers requests
            +  Send requests for fellow travelers
            +  Share created itineraries with other travelers
            + Report a fellow traveler for abusing the app rules

Possible Scenarios : 1 Accept fellow traveler request
                     2 Decline fellow traveler request
                     3 Receive fellowtravelers requests notification

5-Messaging : 
Actors : Traveler, Admin
Use cases : +  Send and receive message from fellowtrvelers
            +  Attach docuemnts / gelocation pin in the messages 
            
            
Possible Scenarios : 1 Receive message notifications

6-Review and ratings : 
Actors : Travelers
Use cases : +  Make rating and review to a fellowtraveler that you shared experience with them
            +  View detailed reviews list on on tarveler account. 
            
            
Possible Scenarios : Make the review and rating anonymous .

7-Manage accounts : 
Actors : Admin
Use cases : + Review users submitted Identity documents
            + Activate\Deactivate  user accounts
            + Manage policy abuses 
            
            
Possible Scenarios : 1-If identity is valid , account activated => activation email sent.
                     2- If identity is not valid , account creation request closed => refusal email sent
                     3- Verify with the reported content or users , and if any policy abuses is happening account needs to be deactivated



By focusing on safety and security, you can create an application that fosters a trustworthy community of travelers, making it easier for users to connect and share experiences.

---------------------------------------------------------------------------------------------------------

1- Authentication

Actors: Traveler
Use cases:
  Register new account
  Login
  Possible Scenarios:
  Verify email address (confirm within the confirmation email)
  Agree to privacy policy
  Submit identity documents to be reviewed by app admin before the account gets activated.
  User forgot password.
  User's account gets activated after identity verification by the app admin.
  User's account gets deactivated if identity verification fails.

2- Manage Profiles

Actors: Traveler
Use cases:
 Edit profile information
 Edit interests and preferences
 Delete account
Possible Scenarios:
  Upload profile picture with conforming size and pixels.
  Fill at least the mandatory fields in the profile.
  Select interests and activities that a user wants with priority (e.g., food, nightlife, etc.).

3- Manage Travels

Actors: Traveler
Use cases:
     Set your status as going on selected destinations
     Search for destinations
     Apply filters to the original search (activities, preferences matching, duration, etc.)
     Create/Save Itineraries
     Edit itinerary details and participants and statuses
     Load saved itineraries
Possible Scenarios:
  When searching for destinations, you can select created itineraries posted to that destination or see other travelers who are going    there.
  Users can share created itineraries with other travelers.


4- Manage FellowTravelers

Actors: Traveler
Use cases:
  Check suggested fellow travelers based on the filters chosen
  Manage fellow traveler requests
  Send requests for fellow travelers
  Remove fellow travelers from the list of suggested travelers
  Cancel a trip or itinerary
Possible Scenarios:
  Accept fellow traveler request
  Decline fellow traveler request
  Receive fellow traveler requests notifications
  Report a fellow traveler for abusing the app rules


5- Real-time Location Sharing

Actors: Traveler
Use cases:
 Share real-time location with fellow travelers during a trip
 Emergency Contacts

Actors: Traveler
Use cases:
 Specify emergency contacts

6 - Messaging

Actors: Traveler, Admin
Use cases:
  Send and receive messages from fellow travelers
  Attach documents / location pins in the messages
Possible Scenarios:
  Receive message notifications


7- Review and ratings

Actors: Travelers
Use cases:
 Make rating and review to a fellow traveler that you shared experiences with them
 View detailed reviews list on a traveler account
 Report inappropriate reviews or ratings
Possible Scenarios:
 Make the review and rating anonymous


8 -Manage accounts

Actors: Admin
Use cases:
  Review users submitted identity documents
  Activate/Deactivate user accounts
  Manage policy abuses
  Reset user's password upon request
Possible Scenarios:
  If identity is valid, account activated => activation email sent.
  If identity is not valid, account creation request closed => refusal email sent
  Verify with the reported content or users, and if any policy abuses are happening, the account needs to be deactivated


# Class diagram : 
1 - Users:
Class: Users
Attributes:

 
  FirstName: String, name of the destination.
  Last_name: String, last name
  email: String, email address.
  password: String, hashed password.
  sessions: Object, a map storing active sessions.
Methods:
  register(): Function, returns a Promise resolving to the newly registered user.
  login(): Function, returns a Promise resolving to the authenticated user.
  logout(): Function, logs out the current user and invalidates the session.

Relationships:
  User and Admin are 2 inherited classes from Users .


2- User:
Class: User
Attributes:
  id: String, unique identifier.
  profile_picture: String, URL for the profile picture.
  bio: String, user's bio or description.
  traveler_preferences: Object, user's travel preferences.
  identity_verified: Boolean, true if identity is verified, false otherwise.
  account_status: String, account status (active, inactive, suspended, etc.).

Methods:
  
  edit_profile(): Function, returns a Promise resolving to the updated user.
  delete_account(): Function, returns a Promise resolving to the deleted user.
  UpdateFellowTravelerRequest() : accept or rejects requests on user's created itinieraries 
  forgot_password(): Function, sends an email to reset the user's password.

Relationships:
  A User can create multiple Itinerarie (1 - to many relationship with Itinerary Class) 
  A User can participate in multiple Conversations(1 - to many relationship with Conversation Class)
  A User can have multiple suggested Fellow Travelers(many -to many multiplicity and data carrying relationship "FellowTravelerRequest"  with Itinerary)
  A user is inhereited from Users Class 
  A user can recveive multiple notifications (1 - to many relationship with Notification Class) .
  A user can receive multriple reviews from other Users ( 1 to many relationship with Review Class).
  A User can have multiple TravelMatches (1 - to many relationship with User Class)

3 - Admin:
Class: Admin
Attributes:
 id: String, unique identifier.
Methods:
  verify_email(): Function, sends an email to verify the user's email address.
  review_identity_documents(): Function, reviews identity documents submitted by users.
  activate_account(): Function, activates a user's account.
  deactivate_account(): Function, deactivates a user's account.
  manage_policy_abuses(): Function, manages policy abuses by users.
  reset_user_password(): Function, resets a user's password upon request.
  authorize_user: Function, checks if a user has the required permissions for a specific action.

Relationships:
  An Admin is one special actionner of Users ( aggregation relationship with Users) .

4- Travel Matching :
Class: TravelMatch
Attributes:
  id: String, unique identifier.
  user1: ObjectId, reference to User 1.
  user2: ObjectId, reference to User 2.
  match_score: Number, compatibility score between the two users.
  match_status: String, status of the travel match (pending, accepted, rejected, etc.).
Methods:
  calculate_match_score(): Function, returns a Number representing the compatibility score.
  create_match(): Function, returns a Promise resolving to the created travel match.
  update_match_status(): Function, returns a Promise resolving to the updated travel match.

Relationships :  
A TravelMatch can involve two Users (many-to-many relationship with User Class) 
A TravelMatch can be associated with one Itinerary (many-to-1 relationship with Itinerary Class)


5- Itinerary:
Class: Itinerary
Attributes:
   id: String, unique identifier.
   user: ObjectId, reference to the user who created the itinerary.
   destination: ObjectId, reference to the destination associated with the itinerary.
   title: String, title of the itinerary.
   description: String, description of the itinerary.
   start_date: Date, start date of the itinerary.
   end_date: Date, end date of the itinerary.
   activities: Array of ObjectId, references to activities associated with the itinerary.
   participants: Array of ObjectId, references to users participating in the itinerary.
   reviews: Array of ObjectId, references to reviews associated with the itinerary.
Methods:
  create_itinerary(): Function, returns a Promise resolving to the created itinerary.
  edit_itinerary(): Function, returns a Promise resolving to the updated itinerary.
  delete_itinerary(): Function, returns a Promise resolving to the deleted itinerary.
  add_activity(): Function, returns a Promise resolving to the updated itinerary with the added activity.
  remove_activity(): Function, returns a Promise resolving to the updated itinerary with the removed activity.
  add_participant(): Function, returns a Promise resolving to the updated itinerary with the added participant.
  remove_participant(): Function, returns a Promise resolving to the updated itinerary with the removed participant.
  add_Destination(): Function returns a promise resolving to the updated itinierary with the added destination
  remove_Destination(): Function, returns a Promise resolving to the updated itinerary with the removed destination.
  share_itinerary(): Function, shares the itinerary with other travelers.
  get_reviews: Function, retrieves reviews associated with the itinerary.
  CreateFellowTravelerRequest() : send the itinerary's creator a join request on this sepecific itinerary .

Relationships:
  An Itinerarie can have multiple destinations (1 - to many relationship with Destination Class) 
  An Itinerarie can have multiple activities (1 - to many relationship with Activity Class) 
  An Itinerary can have multiple suggested Fellow Travelers(many -to many multiplicity and data carrying relationship"FellowTravelerRequest" with User)

6 - Message: This class represents a single message within a conversation. It contains text, attachments, and a timestamp.

Attributes:
  id: A unique identifier for the message.
  sender:ObjectID The user who sent the message.
  text: string , The text content of the message.
  attachments:array of Objects ,  A list of attachments (e.g., images, documents) associated with the message.
  timestamp: datetime , The timestamp when the message was sent.
Methods:
  send_message():function  , Sends the message to the conversation.
 delete_message(): function ,Deletes the message for the current user.

Relationships:
  A message is a part of conversation (many to 1 relationship with Conversation class) .
 

7 - Conversation: This class represents a conversation thread between two or more users. It contains a list of messages and participants. Users can mark conversations as read or unread, delete conversations, or block users.

Attributes:
  id: String, unique identifier.
  title: String, the title of the conversation (optional for direct messages).
  type: String, the type of conversation (direct, group, system).
  participants: Array of ObjectId, references to users participating in the conversation.
  messages: Array of ObjectId, references to messages in the conversation.
  unread_by_user: HashMap, a map that stores whether each participant has read the conversation or not.

Methods:
  add_message(message): Adds a new message to the conversation.
  mark_read_by_user(user): Marks the conversation as read by a specific user.
  delete_conversation(): Deletes the conversation for the current user.
  block_user(user): Blocks a user from participating in the conversation.
  Create_conversation: Function, creates a new conversation.
  update_participants: Function, updates the participants of the conversation.

REMARK : The "type" attribute can be used to differentiate between direct messages and group chats.

  
Relationships:
  A conversation is a the exchange of messages (1 to many relationship with Message class) .
  A User can participate in multiple Conversations(1 - to many relationship with Conversation Class)
  
8 - Activity:
Class: Activity
Attributes:
  id: String, unique identifier.
  name: String, name of the activity.
  description: String, description of the activity.
  duration: Number, duration of the activity in minutes or hours.
  location: Object, location information (address, coordinates, etc.).
Methods:
  create_activity(): Function, returns a Promise resolving to the created activity.
  edit_activity(): Function, returns a Promise resolving to the updated activity.
  delete_activity(): Function, returns a Promise resolving to the deleted activity.

Relationships:
  There's at least 1  Activity in every  Itinerarie (Comnposition relationship with Itinerary Class)

9 - Destination:
Class: Destination
Attributes:
  id: String, unique identifier.
  name: String, name of the destination.
  location: Object, location information (address, coordinates, etc.).
  itineraries: Array of ObjectId, references to itineraries associated with the destination.
Methods:
  create_destination(): Function, returns a Promise resolving to the created destination.
  edit_destination(): Function, returns a Promise resolving to the updated destination.
  delete_destination(): Function, returns a Promise resolving to the deleted destination.

Relationships:
  A destination  is a part of an Itinerarie (Many-to-1 relationship with Itinerary Class)


10 - Notification:
Class: Notification
Attributes:
  id: String, unique identifier.
  user: ObjectId, reference to the user who will receive the notification.
  type: String, type of notification (e.g., fellow traveler request, new message, etc.).
  message: String, the content of the notification.
  read: Boolean, true if the notification has been read, false otherwise.
  timestamp: Date, timestamp when the notification was created.
Methods:
  mark_read(): Function, marks the notification as read.
  delete_notification(): Function, deletes the notification.

Relationships:
 A user can recveive multiple notifications (Many - to 1 relationship with User Class) .

11 - Class: Review
 
Attributes:

   id: String, unique identifier.
   user: ObjectId, reference to the user who wrote the review.
   rating: Number, a rating score (e.g., 1-5 stars).
   content: String, the content of the review.
   timestamp: Date, timestamp when the review was created.

Methods:

   create_review: Function, creates a new review.
   edit_review: Function, edits an existing review.
   delete_review: Function, deletes a review.

Relationships:
A user can receive multriple reviews from other Users ( many to 1 relationship with User Class).

12  -FellowTravelerRequest:
Class: FellowTravelerRequest

Attributes:
  
  status: String, status of the request (pending, accepted, rejected, etc.).
Methods:
 none .
