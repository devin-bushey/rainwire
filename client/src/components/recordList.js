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

const Record = (props) => (
  <tr>
    <td>{props.record.ticket_month}</td>
    <td>{props.record.ticket_day}</td>
    <td>{props.record.ticket_band}</td>
    <td>{props.record.ticket_price}</td>
    {/* <td>{props.record.ticket_soldout}</td> */}
    <td><a href={props.record.link} target="_blank">spotify</a></td>
  </tr>
);

export default class RecordList extends Component {
  // This is the constructor that shall store our data retrieved from the database
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      token: null,
      showTable: false,
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

    axios
      .get("http://localhost:5000/record/")
      .then((response) => {
        this.setState({ records : response.data})
      })
      .catch(function (error) {
        console.log(error);
      });

  }

  // This method will map out the users on the table
  recordList() {

      return this.state.records.map((currentrecord) => {
        return (
          <Record
            record={currentrecord}
            key={currentrecord._id}
          />
        );
      });

  }

  // This following section will display the table with the records of individuals.
  render() {
    return (
      <div>
        <h3>Ticket List</h3>
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

            <table className="table table-striped" style={{ marginTop: 20 }}>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Day</th>
                  <th>Band</th>
                  <th>Price</th>
                  {/* <th>Sold Out</th> */}
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>{this.recordList()}</tbody>

            </table>
          )}
        </div>
      </div>
    );
  }
}