import React, { Component } from "react";
// This will require to npm install axios
import axios from 'axios';

export default class Update extends Component {
    // This is the constructor that stores the data.
    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);

    }

    // This function will handle the submission.
    onSubmit(e) {
        e.preventDefault();

        // When post request is sent to the create url, axios will add a new record(newperson) to the database.

        const newperson = {
            ticket_month: "test2",
            ticket_day: "00",
            ticket_band: "Testing",
        };

        axios
            .post("http://localhost:5000/update", newperson)
            .then((res) => console.log(res.data));

        // We will empty the state after posting the data to the database

    }

    // This following section will display the form that takes the input from the user.
    render() {
        return (
            <div style={{ marginTop: 20 }}>
                <h3>Update</h3>
                <form onSubmit={this.onSubmit}>

                    <div className="form-group">
                        <input
                            type="submit"
                            value="Update"
                            className="btn btn-primary"
                        />
                    </div>
                </form>
            </div>
        );
    }


}


