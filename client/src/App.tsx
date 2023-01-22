import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbarr from './components/navbar';
import MainPage from './components/mainpage';
import DisplayTable from './components/DisplayTable';
import Refresh from './components/refresh';

import axios from 'axios';

const App = () => {
  const ticketsVictoria = GetTickets('victoria');
  const ticketsOttawa = GetTickets('ottawa');
  const ticketsVancouver = GetTickets('vancouver');

  return (
    <Router>
      <Navbarr />
      <br />
      <Routes>
        <Route path="/">
          <MainPage />
        </Route>
        <Route path="/vic">
          <DisplayTable tickets={ticketsVictoria} website="https://thecapitalballroom.com/" />
        </Route>
        <Route path="/van">
          <DisplayTable tickets={ticketsVancouver} website="https://redcat.ca/" />
        </Route>
        <Route path="/ottawa">
          <DisplayTable tickets={ticketsOttawa} website="http://www.vertigorecords.ca/showtickets/index.html" />
        </Route>
        <Route path="/refresh">
          <Refresh />
        </Route>
      </Routes>
    </Router>
  );
};

const GetTickets = (city: string) => {
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

export default App;
