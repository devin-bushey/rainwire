import { useState, useEffect } from "react";
import { GetSpotifyUserInfo } from "../apiManager/Spotify";
import {
  setSpotifyTokenLocalStorage,
  getSpotifyTokenLocalStorage,
} from "../utils/tokenHandling";
import hash from "../utils/hash";

type SpotifyUserDataType = {
  firstName: string;
  user_name: string;
  user_id: string;
  new_playlist_id: string;
  access: boolean;
  error: boolean;
};

const useSpotifyAuth = () => {
  const [token, setToken] = useState<string>("");
  const [spotifyInfo, setSpotifyInfo] = useState<SpotifyUserDataType>({
    firstName: "",
    user_name: "",
    user_id: "",
    new_playlist_id: "",
    access: false,
    error: false,
  });

  useEffect(() => {
    const initializeSpotifyAuth = async () => {
      const localToken = getSpotifyTokenLocalStorage();
      let _token: string;

      if (localToken) {
        _token = localToken;
        setToken(localToken);
      } else {
        _token = hash.access_token || "";
        if (_token) {
          setSpotifyTokenLocalStorage(_token);
          setToken(_token);
        }
      }

      if (_token) {
        const response = await GetSpotifyUserInfo(_token);
        if (response.error) {
          localStorage.clear();
        }

        setSpotifyInfo((prevState) => ({
          ...prevState,
          firstName: response.firstName,
          user_name: response.user_name,
          user_id: response.user_id,
          access: response.access,
        }));
      }
    };

    initializeSpotifyAuth();
  }, []);

  return { token, spotifyInfo };
};

export default useSpotifyAuth;
