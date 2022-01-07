import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";

import Navbarr from "./components/navbar";
import MainPage from "./components/mainpage";
import DisplayTable from "./components/DisplayTable";
import Footer from "./components/footer";

import axios from 'axios';

const App = () => {

  const [showApp, setShowApp] = useState(false);

  const ticketsVictoria = GetTickets("victoria");
  const ticketsOttawa = GetTickets("ottawa");
  const ticketsVancouver = GetTickets("vancouver");

  // only show app if all ticket data is available
  useEffect(() => {

    if (ticketsOttawa.length > 0 && ticketsVancouver.length > 0 && ticketsVictoria.length > 0) {
      setShowApp(true);
    }

  }, [ticketsOttawa, ticketsVancouver, ticketsVictoria]);

  if (showApp) {

    return (

      <div>
        <Navbarr />
        <Route exact path="/">
          <MainPage />
        </Route>
        <Route path="/vic">
          <DisplayTable tickets={ticketsVictoria} website="https://victoriamusicscene.com/concerts/"/>
        </Route>
        <Route path="/van">
          <DisplayTable tickets={ticketsVancouver} website="https://redcat.ca/"/>
        </Route>
        <Route path="/ottawa">
          <DisplayTable tickets={ticketsOttawa} website="http://www.vertigorecords.ca/showtickets/index.html"/>
        </Route>

      </div>
    );

  }
  else {

    return (
      <div>
        <br />
        <br />
        <br />
        <p>Loading...</p>
      </div>
    );

  }


};

function GetTickets(city) {

  const [tickets, setTickets] = useState([]);

  // hook only runs once on mount
  useEffect(() => {

    axios
      .get(process.env.REACT_APP_SITE_URL_DB + city + "/")
      .then((response) => {
        setTickets(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });

  }, []);

  return tickets;

}

export default App;