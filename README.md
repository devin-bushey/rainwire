# Record Shop

<i>https://recordshop.cool</i>

A full-stack web application used to help users find new music. The application gathers upcoming concert ticket information by either web scraping different websites or using the JamBase API and then uses the Spotify API for creating playlists. The app can create a new playlist populated with the top tracks from the artists on each concert ticket, and the playlist will show up directly on the user's Spotify account.

Record Shop is developed using the MERN stack, which uses MongoDB, Express, React, and Node and is hosted on Netlify, Render, and MongoDB Atlas.

## Local Development Setup

#### 1. Set up your Spotify API Key

1. Create a [Spotify Developer account](https://developer.spotify.com/documentation/web-api/quick-start/#:~:text=To%20use%20the%20Web%20API,complete%20your%20account%20set%20up.)
2. Find your Spotify client ID and secret from the Spotify Dashboard

#### 2. Set your environment variables

- In the root directory, create a `.env` file and paste the following:

    <details>
      <summary><i>.env</i></summary>

      ```md
      ATLAS_URI='mongodb://root:example@localhost:27017/'

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

      API_KEY_JAMBASE=
      ```

    </details>

#### 3. Start your Docker container

- In the root directory, run:

  ```bash
  docker compose up --build -d
  ```

  This will set up 4 containers:

  1. `frontend` - an instance of the `/client` app on port 3000
  2. `backend` - an instance of the `/backend` app on port 5000
  3. `mongo` - some DB shenanigans
  4. `mongo-express` - some more DB shenanigans

#### 4. Hot-reload your apps

For quick development feedback with hot-reloading, complete the following steps:

1. Install the dependencies:
   - In the root directory, run: `npm run setup`
2. Stop the associated Docker container(s):
   - In your Docker application, stop the `backend` and/or `frontend` containers (whichever you want to hot-reload)
3. Startup your local app(s) with hot reloading:

   - <b>frontend/client</b> - navigate to your `/client` directory and run: `npm start`
     - see the beauty at http://localhost:3000/
   - <b>backend</b> - navigate to your `/backend` directory and run: `npm run start:dev`
     - this runs on port 5000 but you probably won't be accessing it by its url

   > <b>!! HOT TIP !!</b>
   >
   > You can start up both apps concurrently by running the following command in your root directory: `npm run dev`

   > <b>> NOTE</b>
   >
   > Stopping the associated Docker container(s) is essential as these local commands will run the apps on the same ports:
   >
   > <b>frontend/client</b> (3000)
   >
   > <b>backend</b> (5000)

#### 5. Database

You can view the database in your browser by navigating to http://localhost:8081/

- use the following credentials:

  ```bash
  username: admin
  password: pass
  ```

- Useful Docker commands for debugging:

  ```bash
  $ docker exec -it mongo mongosh
  > db.auth('root', 'example')
  > use RecordShop
  > show collections
  ```
