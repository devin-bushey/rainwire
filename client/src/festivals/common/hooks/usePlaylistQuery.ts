import { QueryFunction, useQuery } from "react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { Playlist } from "../types/Playlist";
import { useAuth } from "../../../context/AuthContext";

export const usePlaylistQuery = (playlistName: string) => {
  const queryOptions = {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    cacheTime: Infinity,
    keepPreviousData: true,
  };

  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState<boolean>(true);
  const { token, spotifyInfo } = useAuth();

  const getPlaylistsQueryFn: QueryFunction<Playlist> = async () => {
    try {
      if (!token || !spotifyInfo.user_id) {
        throw new Error("Token or user id is missing");
      }

      const response = await axios.get(import.meta.env.VITE_SITE_URL_DB + "playlist", {
        params: {
          token: token,
          userId: spotifyInfo.user_id,
          playlistName: playlistName,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error("Error fetching playlists: " + error.message);
    }
  };

  useEffect(() => {
    if (token && spotifyInfo.user_id) {
      setIsLoadingUserInfo(false);
    }
  }, [token, spotifyInfo.user_id]);

  return useQuery({
    queryKey: [playlistName],
    queryFn: getPlaylistsQueryFn,
    ...queryOptions,
    enabled: !isLoadingUserInfo,
  });
};
