require("dotenv").config({ path: "../../.env" });
import axios from "axios";

const SP_REFRESH_TOKEN = process.env.SP_REFRESH_TOKEN;
const SP_CLIENT_ID = process.env.SP_CLIENT_ID;
const SP_CLIENT_S = process.env.SP_CLIENT_S;

export const getSpotifyAccessToken = async () => {
  const optionsSpotifyAccessToken = {
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization: `Basic ${Buffer.from(SP_CLIENT_ID + ":" + SP_CLIENT_S).toString("base64")}`,
    },
    params: {
      grant_type: "refresh_token",
      refresh_token: SP_REFRESH_TOKEN,
      client_id: SP_CLIENT_ID,
    },
  };

  try {
    console.log("Getting Spotify token...");
    const response = await axios(optionsSpotifyAccessToken);
    console.log("Yew!! Successfully retrieved the token");
    return response.data.access_token;
  } catch (error: any) {
    console.error("Failed to get Spotify token");
    process.exit(-1);
  }
};
