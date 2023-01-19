import React from "react";

import axios from 'axios';

const Refresh = () => {

    const handleWebScrape = () => {
        axios
            .get(process.env.REACT_APP_SITE_URL_DB + "webscrape" + "/")
            .then((response) => {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const handleAddSpotify = () => {
        axios
            .get(process.env.REACT_APP_SITE_URL_DB + "addspotify" + "/")
            .then((response) => {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    return (
        <div>
            <button onClick={handleWebScrape}>Web Scrape</button>
            <button onClick={handleAddSpotify}>Add Spotify</button>
        </div>
    )

};
export default Refresh;