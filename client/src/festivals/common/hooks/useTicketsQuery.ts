import { QueryFunction, useQuery } from "react-query";
import { Cities, Festivals } from "../../../constants/enums";
import { getTicketsCities } from "../apiManager/getTickets";

// Custom hook for handling data fetching
export const useTicketsQuery = (queryKey: Festivals | Cities) => {
  const queryOptions = {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    cacheTime: Infinity,
    keepPreviousData: true,
  };

  const getTicketQueryFn: QueryFunction<any> = async () => {
    try {
      const data = await getTicketsCities(queryKey);
      return data;
    } catch (error) {
      throw new Error("Error fetching tickets");
    }
  };

  return useQuery({
    queryKey: [queryKey],
    queryFn: getTicketQueryFn,
    ...queryOptions,
  });
};
