import React, { Component } from "react";
// This will require to npm install axios
import axios from 'axios';
import hash from "./hash";
import * as $ from "jquery";
import styles from './styles/mainpage.module.css';

import configData from "./../../src/config.json"; //development
const clientId = configData.SP_CLIENT_ID; //development

export const authEndpoint = 'https://accounts.spotify.com/authorize';
//const clientId = process.env.REACT_APP_SP_CLIENT_ID; //production
//const redirectUri = "https://recordshopp.netlify.app/"; //production
const redirectUri = "http://localhost:3000";
const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "playlist-modify-public",
  "playlist-modify-private"

];


export default class MainPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      token: null,
      user_name: "",
      user_id: "",
      new_playlist_id: "",
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
  
        await this.getSpotifyUserInfo(_token);
  
      }
      else{
        console.log("no token");
      }
  
    }

  async getSpotifyUserInfo(token) {

    console.log(token);

    $.ajax({
      url: "https://api.spotify.com/v1/me/",
      type: "GET",
      beforeSend: xhr => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: data => {
        
        if (!data) {
          return;
        }

        this.setState({
          user_name: data.display_name,
          user_id: data.id
        })

      },
      error: function (error) {
        console.log(error.responseText);
      }
    });

  }

  async createBlankPlaylist(user_id, token, city) {

    var playlist_name = "Record Shop - " + city;

    return new Promise(async function (resolve, reject) {
      $.ajax({
        type: 'POST',
        url: 'https://api.spotify.com/v1/users/' + user_id + '/playlists',
        data: JSON.stringify({
          "name": playlist_name,
          "description": "a fun description",
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

          console.log('Successfully created a playist: ' + playlist_name);

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

  handleClickVancouver = () => {

    var city = "vancouver";

    if (window.confirm('Are you sure you want to create a new playlist?')) {
      this.createNewPlaylist(this.state.user_id, this.state.token, city);
    }

  }

  handleClickOttawa = () => {

    var city = "ottawa";

    if (window.confirm('Are you sure you want to create a new playlist?')) {
      this.createNewPlaylist(this.state.user_id, this.state.token, city);
    }

  }

  async createNewPlaylist(user_id, token, city) {

    var playlist_id = await this.createBlankPlaylist(user_id, token, city);

    //.get("https://record-shop.herokuapp.com/" + city + "/") //production

    await axios
      .get("http://localhost:5000/" + city + "/")
      .then((response) => {
        var data = response.data
        var tracks = "";
        var numTopTracksToAdd = 1;

        for (const element of data) {

          try {

            for (let i = 0; i < numTopTracksToAdd; i++) {
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
        console.log("error axios get create new playlist")
        console.log(error);
      });

  }

  render() {
    return (
      <div className="styles.body">

        <h3>Welcome</h3>

        <div>
          {!this.state.token && (
            <button>
              <a
                className="btn btn--loginApp-link"
                href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                  "%20"
                )}&response_type=token&show_dialog=true`}
              >
                Login to Spotify
              </a>
            </button>
          )}
        </div>

        <div>
          {this.state.token && this.state.user_id.length > 0 && (
            <div className="container-sm">
              <p>Hey {this.state.user_name}!</p>
              <p>Create a new playlist from shows playing in: </p>
              <button style={{ margin: 10 }} onClick={this.handleClickVancouver}>
                Vancouver
              </button>
              <button style={{ margin: 10 }} onClick={this.handleClickOttawa}>
                Ottawa
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
