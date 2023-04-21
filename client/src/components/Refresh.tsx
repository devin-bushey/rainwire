import axios from 'axios';

const Refresh = () => {
  const handleWebScrape = () => {
    axios
      .get(import.meta.env.VITE_SITE_URL_DB + 'webscrape' + '/')
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleAddSpotify = () => {
    axios
      .get(import.meta.env.VITE_SITE_URL_DB + 'addspotify' + '/')
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleDropDB_1 = () => {
    axios
      .get(import.meta.env.VITE_SITE_URL_DB + 'drop_db_victoria_' + '/')
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleDropDB_2 = () => {
    axios
      .get(import.meta.env.VITE_SITE_URL_DB + 'drop_db_victoria_spotify' + '/')
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleExtract = () => {
    axios
      .get(import.meta.env.VITE_SITE_URL_DB + 'extract' + '/')
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleUpdateCollectionWithSpotify = () => {
    axios
      .get(import.meta.env.VITE_SITE_URL_DB + 'updateCollectionWithSpotify' + '/')
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <button onClick={handleWebScrape}>Web Scrape</button>
      <button onClick={handleAddSpotify}>Add Spotify</button>
      <button onClick={handleDropDB_1}>drop_db_victoria_</button>
      <button onClick={handleDropDB_2}>drop_db_victoria_spotify</button>
      <button onClick={handleExtract}>extract</button>
      <button onClick={handleUpdateCollectionWithSpotify}>updateCollectionWithSpotify</button>
    </>
  );
};
export default Refresh;
