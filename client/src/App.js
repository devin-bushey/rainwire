import React from "react";

// We use Route in order to define the different routes of our application
import { Route } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import MainPage from "./components/mainpage";
import Vancouver from "./components/vancouver";
import Ottawa from "./components/ottawa";

const App = () => {
  return (
    <div>
      <Navbar />
      <Route exact path="/">
        <MainPage />
      </Route>
      <Route path="/van">
        <Vancouver />
      </Route>
      <Route path="/ottawa">
        <Ottawa />
      </Route>
    </div>
  );
};

export default App;