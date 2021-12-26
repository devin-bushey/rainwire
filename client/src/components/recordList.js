import React, { Component } from "react";
// This will require to npm install axios
import axios from 'axios';
import hash from "./hash";

//TODO - Store in .config file
export const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = "276aafa1475e4e5883df3bdf2899fc3a";
const redirectUri = "http://localhost:3000";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
];


export default class RecordList extends Component {
  // This is the constructor that shall store our data retrieved from the database
  constructor(props) {
    super(props);
    this.state = {
      token: null,
    }

  }

  // This method will get the data from the database.
  async componentDidMount() {

    //Spotify
    let _token = hash.access_token;
    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
    }

  }


  // This following section will display the table with the records of individuals.
  render() {
    return (
      <div>
        <h3>Welcome</h3>
        <div>
          {!this.state.token && (
            <a
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </a>
          )}
        </div>

        <div>
          {this.state.token && (

            <p>Success!</p>
          )}
        </div>
      </div>
    );
  }
}