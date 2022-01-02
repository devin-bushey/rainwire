//import React from "react";
import React, { useState, useEffect } from "react";

// We use Route in order to define the different routes of our application
import { Route } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import MainPage from "./components/mainpage";
import DisplayTable from "./components/DisplayTable";

// for get requests
import axios from 'axios';

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

const App = () => {

  const [showApp, setShowApp] = useState(false);

  const ticketsOttawa = GetTickets("ottawa");
  const ticketsVancouver = GetTickets("vancouver");

  // only show app if all ticket data is available
  useEffect(() => {

    if (ticketsOttawa && ticketsVancouver) {
      setShowApp(true);
    }

  }, [ticketsOttawa, ticketsVancouver]);

  if (showApp) {

    return (
      <div>
        <Navbar />
        <Route exact path="/">
          <MainPage />
        </Route>
        <Route path="/van">
          <DisplayTable tickets={ticketsVancouver} />
        </Route>
        <Route path="/ottawa">
          <DisplayTable tickets={ticketsOttawa} />
        </Route>
      </div>
    );

  }
  else {

    return (
      <div>
        <p>Loading...</p>
      </div>
    );

  }


};

export default App;