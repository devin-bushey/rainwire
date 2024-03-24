import { useState, useEffect } from "react";
import { UseQueryResult } from "react-query";
import { sortByOrderNum } from "../../../utils/sorter";

// Custom hook for managing ticket-related state
export const useTicketsState = (query: UseQueryResult, loadInterval: number) => {
  const [loadMore, setLoadMore] = useState(loadInterval);
  const [totalTickets, setTotalTickets] = useState([]);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    if (query.data) {
      setLoadMore(loadInterval);
      setTotalTickets(sortByOrderNum(query.data));
    }
  }, [query.data]);

  useEffect(() => {
    setTickets(totalTickets.slice(0, loadInterval));
    setLoadMore(loadInterval);
  }, [totalTickets]);

  useEffect(() => {
    setTickets(totalTickets.slice(0, loadMore));
  }, [loadMore]);

  return { loadMore, setLoadMore, totalTickets, tickets };
};
