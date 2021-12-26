import React from "react";

// We use Route in order to define the different routes of our application
import { Route } from "react-router-dom";

// We import all the components we need in our app
import Navbar from "./components/navbar";
import Create from "./components/create";
import Update from "./components/update";
import RecordList from "./components/recordList";
import Vancouver from "./components/vancouver";
import Ottawa from "./components/ottawa";

const App = () => {
  return (
    <div>
      <Navbar />
      <Route exact path="/">
        <RecordList />
      </Route>
      <Route path="/create">
        <Create />
      </Route>
      <Route path="/update">
        <Update />
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