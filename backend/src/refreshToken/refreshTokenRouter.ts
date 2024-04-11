import axios, { AxiosRequestConfig } from "axios";
import express, { Request, Response } from "express";

export const refreshTokenRouter = express.Router();

const CLIENT_ID = process.env.SP_CLIENT_ID as string;
const CLIENT_SECRET = process.env.SP_CLIENT_S as string;
const REDIRECT_URI = "http://localhost:5000/callback";
const SCOPE = ["playlist-modify-public"];

// A refresh token allows client applications to obtain new access tokens without requiring users to reauthorize the application.
// https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens

// Follow these steps to get a refresh token:
// Run the server (npm run dev)
// From your browser, go to http://localhost:5000/login
// Sign in with your account
// Copy the redirect token
// Paste it into the root .env as SP_REFRESH_TOKEN

refreshTokenRouter.get("/login", (request: Request, response: Response) => {
  const redirect_url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${SCOPE.join("%20")}&state=123456&redirect_uri=${REDIRECT_URI}&prompt=consent`;
  response.redirect(redirect_url);
});

refreshTokenRouter.get("/callback", async (request: Request, response: Response) => {
  const code = request.query["code"] as string;
  const tokenRequestConfig: AxiosRequestConfig = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    auth: {
      username: CLIENT_ID,
      password: CLIENT_SECRET,
    },
  };

  try {
    const resp1 = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
        code: code,
      }),
      tokenRequestConfig,
    );

    const resp2 = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: resp1.data.refresh_token,
      }),
      tokenRequestConfig,
    );

    response.json([resp1.data, resp2.data]);
  } catch (error) {
    console.error("Error occurred during token refresh:");
    response.status(500).json({ error: "Failed to refresh token" });
  }
});
