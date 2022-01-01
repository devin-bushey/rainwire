//import React from "react";
import React, { useState, useEffect } from "react";
import axios from 'axios';

// We use Route in order to define the different routes of our application
import { Route } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import MainPage from "./components/mainpage";
import DisplayTable from "./components/displayTable";

function getTickets(city) {

  const [tickets, setTickets] = useState([]);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    //Runs only on the first render
    axios
      .get("http://localhost:5000/" + city + "/")
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

  const ticketsOttawa = getTickets("ottawa");
  const ticketsVancouver = getTickets("vancouver");

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {

    //Runs only on the first render
    if (ticketsOttawa && ticketsVancouver) {
      setShowApp(true);
    }

  }, []);

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