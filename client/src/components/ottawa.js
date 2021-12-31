import React, { Component } from "react";
// This will require to npm install axios
import axios from 'axios';

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

export default class Ottawa extends Component {
  // This is the constructor that shall store our data retrieved from the database
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      showTable: false,
    }

  }

  // This method will get the data from the database.
  async componentDidMount() {

    //.get("https://record-shop.herokuapp.com/ottawa/") //production

    axios
      .get("http://localhost:5000/ottawa/")
      .then((response) => {
        this.setState({ records : response.data, showTable : true })
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
        <h3>Ottawa</h3>
        
        <div>
          {this.state.showTable && (

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