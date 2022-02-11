# Record Shop

https://recordshopp.netlify.app/

A full-stack web application used to help users find new music. The application gathers upcoming concert ticket information from the websites of local record shops and then uses the Spotify API for user authentication, authorization, and retrieving data. The app can create a new playlist populated with the top tracks from the artists on each concert ticket, and the playlist will show up directly on the user's Spotify account. Due to the app being in development, Spotify only allows a maximum of 25 users, therefore users must be registered by myself through the Spotify developer dashboard.

Record Shop is developed using the MERN stack, which uses React hooks, MongoDB Atlas, Express.js, Node.js, and is hosted on Netlify and Heroku. The application was developed with information security in mind. Users are authorized using the OAuth 2.0 authorization framework and secret keys are hidden through environment variables.

I have currently spent 3 weeks actively developing this project from the ground up. I have been implementing a Trello board to keep the project organized and have been using git for version control, pull requests, and production pipelines. In the future I will be focusing on better database design and management as well as general refactoring to ensure the code meets today’s best practices.

Current issues with the project include:
-	Flickers when switching between ticket view and main view (because of re-renders of the access token state variable)
-	Not all artists are correctly linked to Spotify. (requires better extraction methods of ticket information)

Upcoming features:
-	Faster loading
-	Sort by genre


