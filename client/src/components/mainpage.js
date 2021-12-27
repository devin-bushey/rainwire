import React, { Component } from "react";
// This will require to npm install axios
import axios from 'axios';
import hash from "./hash";
import * as $ from "jquery";


//TODO: - Store in .config file
export const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = "276aafa1475e4e5883df3bdf2899fc3a";
const redirectUri = "http://localhost:3000";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "playlist-modify-public",
  "playlist-modify-private"

];




export default class MainPage extends Component {
  // This is the constructor that shall store our data retrieved from the database
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      user_name: "",
      user_id: "",
      new_playlist_id: "",
    }

  }

  async getSpotifyUserInfo(token) {

    $.ajax({
      url: "https://api.spotify.com/v1/me/",
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: data => {
        // Checks if the data is not empty
        if (!data) {
          return;
        }

        //console.log(data);
        //console.log(data.id);

        this.setState({
          user_name: data.display_name,
          user_id: data.id
        })

        //comment out for testing
        //this.createPlaylist(data.id, token);

      }
    });

  }

  async createPlaylist(user_id, token) {

    $.ajax({
      type: 'POST',
      url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
      data: JSON.stringify({
        "name": "New Playlist",
        "description": "New playlist description",
        "public": false
      }),
      dataType: 'json',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      success: function (result) {
        
        this.setState({
          new_playlist_id: result.id,
        })

        console.log('Successfully created a playist');

        console.log(result.id);

        this.addTracksToPlaylist(result.id, token);

      }.bind(this),
      error: function (error) {
        console.log(error.responseText);
      }
    })

  }

  async addTracksToPlaylist(playlist_id, token){

    $.ajax({
      type: 'POST',
      url: "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks",
      data: JSON.stringify({
        "uris": [
          "spotify:track:34jJMESTPsGq0PT8r9yWhj"
        ],
        "position": 0
      }),
      dataType: 'json',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      success: function (result) {
        
        console.log("successfully added tracks to playlist");

      }.bind(this),
      error: function (error) {
        console.log(error.responseText);
      }
    })
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

      await this.getSpotifyUserInfo(_token);

    }

  }

  handleClick = () => {

    if (window.confirm('Are you sure you want to create a new playlist?')) {
      this.createPlaylist(this.state.user_id, this.state.token);
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
          {this.state.token && this.state.user_id.length > 0 && (
            <div>
              <p>Hey {this.state.user_name} !</p>
              <button onClick={this.handleClick}>
                Create Playlist
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}