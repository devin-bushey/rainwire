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
      vancouver_data: null,
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

  async createNewPlaylist(user_id, token) {

    return new Promise(async function (resolve, reject) {
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

        resolve(result.id);

        console.log('Successfully created a playist');

        console.log(result.id);

        //this.addTracksToPlaylist(result.id, token);

      }.bind(this),
      error: function (error) {
        console.log(error.responseText);
      }
    })

  }.bind(this))

  }

  async addTracksToPlaylist(playlist_id, tracks, token) {

    $.ajax({
      type: 'POST',
      url: "https://api.spotify.com/v1/playlists/" + playlist_id + "/tracks?uris=" + tracks,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      success: function (result) {

        console.log("successfully added tracks to playlist");

      }.bind(this),
      error: function (error) {
        console.log("error: unsuccessfully added tracks to playlist");
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

  handleClickVancouver = () => {

    /* if (window.confirm('Are you sure you want to create a new playlist?')) {
      this.createPlaylist(this.state.user_id, this.state.token);
    } */

    if (window.confirm('Are you sure you want to create a new playlist?')) {
      this.createPlaylistVancouver(this.state.user_id, this.state.token);
    }

  }

  handleClickOttawa = () => {

    /* if (window.confirm('Are you sure you want to create a new playlist?')) {
      this.createPlaylist(this.state.user_id, this.state.token);
    } */

    if (window.confirm('Are you sure you want to create a new playlist?')) {
      this.createPlaylistOttawa(this.state.user_id, this.state.token);
    }

  }

  async createPlaylistVancouver(user_id, token) {

    var playlist_id = await this.createNewPlaylist(user_id, token);

    await axios
      .get("http://localhost:5000/vancouver/")
      .then((response) => {
        var data = response.data
        var tracks = "";

        for (const element of data) {

          try {

            for (let i = 0; i < 3; i++) {
              tracks += element.top_tracks[i].uri;
              tracks += ",";
            }

          }
          catch { }

        }

        tracks = tracks.substring(0, tracks.length - 1); // remove last comma

        this.addTracksToPlaylist(playlist_id, tracks, token);

      })
      .catch(function (error) {
        console.log("error axios get Vancouver")
        console.log(error);
      });




  }

  
  async createPlaylistOttawa(user_id, token) {

    var playlist_id = await this.createNewPlaylist(user_id, token);

    axios
      .get("http://localhost:5000/ottawa/")
      .then((response) => {
        var data = response.data
        var tracks = "";

        for (const element of data) {

          try {

            for (let i = 0; i < 1; i++) {
              tracks += element.top_tracks[i].uri;
              tracks += ",";
            }

          }
          catch { }

        }

        tracks = tracks.substring(0, tracks.length - 1); // remove last comma

        this.addTracksToPlaylist(playlist_id, tracks, token);

      })
      .catch(function (error) {
        console.log("error axios get Vancouver")
        console.log(error);
      });




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
              <button onClick={this.handleClickVancouver}>
                Create Playlist For Vancouver
              </button>
              <button onClick={this.handleClickOttawa}>
                Create Playlist For Ottawa
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}