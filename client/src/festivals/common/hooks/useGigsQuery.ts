import { QueryFunction, useQuery } from "react-query";
import { Cities, Festivals } from "../../../constants/enums";
import { getArtistsFromRecordShop } from "../apiManager/getArtistsFromRecordShop";
import { Gig } from "../types/Gig";

export const useGigsQuery = (queryKey: Festivals | Cities) => {
  const queryOptions = {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    cacheTime: Infinity,
    keepPreviousData: true,
  };

  const getGigQueryFn: QueryFunction<Gig[]> = async () => {
    try {
      return await getArtistsFromRecordShop(queryKey);
    } catch (error) {
      throw new Error("Error fetching gigs");
    }
  };

  return useQuery({
    queryKey: [queryKey],
    queryFn: getGigQueryFn,
    ...queryOptions,
  });
};
