import React, { useState, useEffect } from "react";
// This will require to npm install axios
import axios from 'axios';

const DisplayTable = (data) => {

    return (
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Band</th>
            <th>Price</th>
            {/* <th>Sold Out</th> */}
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{newRecordList(data.tickets)}</tbody>

      </table>
    );
  }

  function newRecordList(props) {

    return props.map((currentrecord) => {
      return (
        <Record
          record={currentrecord}
          key={currentrecord._id}
        />
      );
    });

  }

  const Record = (props) => (
    <tr>
      <td>{props.record.ticket_date}</td>
      <td>{props.record.ticket_band}</td>
      <td>{props.record.ticket_price}</td>
      <td><a href={props.record.link} target="_blank">spotify</a></td>
    </tr>
  );

  export default DisplayTable;