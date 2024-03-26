import { QueryFunction, useQuery } from "react-query";
import axios from "axios";
import { useState, useEffect } from "react";

export const usePlaylistQuery = (token: string, userId: string, playlistName: string) => {
  const queryOptions = {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    cacheTime: Infinity,
    keepPreviousData: true,
  };

  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState<boolean>(true);

  const getPlaylistsQueryFn: QueryFunction<any> = async () => {
    try {
      if (!token || !userId) {
        throw new Error("Token or user id is missing");
      }

      const response = await axios.get(import.meta.env.VITE_SITE_URL_DB + "playlist", {
        params: {
          token: token,
          userId: userId,
          playlistName: playlistName,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error("Error fetching playlists: " + error.message);
    }
  };

  useEffect(() => {
    if (token && userId) {
      setIsLoadingUserInfo(false);
    }
  }, [token, userId]);

  return useQuery({
    queryKey: [playlistName],
    queryFn: getPlaylistsQueryFn,
    ...queryOptions,
    enabled: !isLoadingUserInfo,
  });
};
