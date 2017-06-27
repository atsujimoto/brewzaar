#Brewzaar

Brewzaar is a web app that utilizes BreweryDB's API to help users trade the beer they have for the beer they want.  Users can search for a beer by name or by brewery and then add it either their Wanted Beers or Owned Beers.  From their profile page, they can then see other users that either have the beers they want, or want the beers they own.  The idea would be to then contact these other users to try and initate a trade.

##Approach

This was my first time building something that utilized an API, so lots of time was spent going over BreweryDB's documentation.  This was also my first time using MongoDB, although in hindsight, SQL might have been better suited for this project.

First steps were to read the API documentation and figure out:

 - What were all the possible API routes I could hit and what did each of those return.
 - Specifically, how would I allow a user to search for a beer, and what relavent information from the returned object would I want to display to the user. (ie: name, manufacturer, alcohol %, etc)

Once I understood the API, next steps were to figure out:

 - How to create a database with MongoDB as well as set up the collections (tables)
 - How I was going to create the many to many relations between Beers and Users, since I needed multiple users to be able to "want/own" a single beer, and for multiple beers to be "wanted/owned" by a single user.

###Unsolved Problems

The biggest issue I have yet to figure out is how to allow users to safely contact each other.  As is, if you were to click on one of your "wanted" beers to see a list of users that own that beer, you get returned a list of usernames and their emails.  The idea being that you could simply send them an email directly offering a trade.  While this is simple, it's certainly not secure, as most people probably wouldn't feel comfortable having their personal email out for anyone to see.

I also need to add a way to delete beers from a users "wanted/owned" lists, as well as delete unecessary beers from the database.  The way it's set up currently, whenever a user adds a beer to one of their lists the app checks the database first.  If the beer isn't found in the database, it creates a new database entry with the relavent information from the API.  This was to ensure I didn't eat up all my API calls by having to search the API everytime I needed beer information.  To keep my database uncluttered, however, I need to set up a check where if a beer has no users associated with it, it gets deleted from the database.

It can sometimes be difficult/impossible to ship beer as laws vary from state to state/country to country.  I would like to implement some way to help users easily understand how to ship beer/have beer shipped to them.  The simplest way would be to just have links to the relavent documentation for every state/country, but it also be cool to simply omit irrelavent users from their search results and give them simplified instructions if shipping is possible.

##Next Steps

 - Add delete button for beers saved to a users profile
 - Add a check to delete unnecessary beers from the database
 - Set up either an in-app messaging system, or a Craigslist-style email relay to create a buffer between users
 - Have links to documentation on shipping alcohol

##Technologies Used

 - BreweryDB API
 - ejs layouts
 - jQuery
 - Materialize
 - Express
 - MongoDB/Mongoose
 - Session
 - bcrypt

##Installation Instuctions

 - You'll need an API key from [BreweryDB](http://www.brewerydb.com/developers)
 - And a SESSION_SECRET
