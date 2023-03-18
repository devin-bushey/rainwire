# Record Shop

https://recordshopp.netlify.app/

A full-stack web application used to help users find new music. The application gathers upcoming concert ticket information from the websites of local record shops and then uses the Spotify API for user authentication, authorization, and retrieving data. The app can create a new playlist populated with the top tracks from the artists on each concert ticket, and the playlist will show up directly on the user's Spotify account. Due to the app being in development, Spotify only allows a maximum of 25 users, therefore users must be registered by myself through the Spotify developer dashboard.

Record Shop is developed using the MERN stack, which uses MongoDB, Express, React, and Node and is hosted on Netlify, Render, and MongoDB Atlas. 

## Local Development Setup

### Spotify API Key

- Create an [Spotify Developer account](https://developer.spotify.com/documentation/web-api/quick-start/#:~:text=To%20use%20the%20Web%20API,complete%20your%20account%20set%20up.)
- Find your Spotify client id and secret from the Spotify Dashboard

### .env in the root directory

ATLAS_URI=mongodb://localhost:27017/

SP_CLIENT_ID=

SP_MY_USER_ID=

SP_CLIENT_S=

VITE_SP_CLIENT_ID=

VITE_SITE_URL_DB='http://localhost:5000/'

VITE_SITE_URL='http://localhost:3000/'

VITE_PORT=3000

VITE_HOST='localhost'

VITE_EMAIL_SERVICEID=

VITE_EMAIL_TEMPLATEID=

VITE_EMAIL_PUBKEY=

VITE_SPOTIFY_PREVIEW_PLAYLIST_URL=

### Docker Compose

- From the root directory where the docker compose yml file is, run:
```bash
docker compose up --build -d
```

### Frontend 

You can optionally stop the frontend docker container and run the frontend locally

Runs on port 3000

```bash
cd frontend
npm i
npm start
```

### Backend

You can optionally stop the backend docker container and run the backend locally

Runs on port 5000

```bash
cd backend
npm i
npm run start:dev
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

