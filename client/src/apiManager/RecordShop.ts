import axios from 'axios';
import { useState, useEffect } from 'react';

export const GetTickets = (city: string) => {
  const [tickets, setTickets] = useState([]);

  // hook only runs once on mount
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_SITE_URL_DB + city + '/')
      .then((response) => {
        setTickets(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return tickets;
};
