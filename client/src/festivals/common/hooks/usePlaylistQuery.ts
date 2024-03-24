import { QueryFunction, useQuery } from "react-query";
import axios from "axios";
import useSpotifyAuth from "../../../hooks/useSpotifyAuth";
import { useState, useEffect } from "react";

// Custom hook for handling data fetching
export const usePlaylistQuery = (playlistName: string) => {
  const queryOptions = {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    cacheTime: Infinity,
    keepPreviousData: true,
  };

  const { token, spotifyInfo } = useSpotifyAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getPlaylistsQueryFn: QueryFunction<any> = async () => {
    try {
      if (!token || !spotifyInfo || !spotifyInfo.user_id) {
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
    if (token && spotifyInfo && spotifyInfo.user_id) {
      setIsLoading(false);
    }
  }, [token, spotifyInfo]);

  const {
    data,
    isLoading: queryIsLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [playlistName],
    queryFn: getPlaylistsQueryFn,
    ...queryOptions,
    enabled: !isLoading, // Don't make the query until loading is false
  });

  if (isLoading) {
    return { isLoading: true }; // Return loading state
  }

  return { data, isLoading: queryIsLoading, isError, error };
};
