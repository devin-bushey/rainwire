import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbarr from './components/navbar';
import MainPage from './components/mainpage';
import DisplayTable from './components/DisplayTable';
import Refresh from './components/refresh';

import axios from 'axios';
import NotFound from './components/NotFound';

const App = () => {
  const WEBSITE_VIC = 'https://thecapitalballroom.com/';
  const WEBSITE_VAN = 'https://redcat.ca/';
  const WEBSITE_OTT = 'http://www.vertigorecords.ca/showtickets/index.html';

  const ticketsVictoria = GetTickets('victoria');
  const ticketsOttawa = GetTickets('ottawa');
  const ticketsVancouver = GetTickets('vancouver');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbarr />}>
          <Route index element={<MainPage />} />
          <Route path="/vic" element={<DisplayTable tickets={ticketsVictoria} website={WEBSITE_VIC} />} />
          <Route path="/van" element={<DisplayTable tickets={ticketsVancouver} website={WEBSITE_VAN} />} />
          <Route path="/ottawa" element={<DisplayTable tickets={ticketsOttawa} website={WEBSITE_OTT} />} />
          <Route path="/refresh" element={<Refresh />} />
          <Route path="*" element={<NotFound />} />
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
