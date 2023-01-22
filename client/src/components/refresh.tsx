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

  return (
    <>
      <button onClick={handleWebScrape}>Web Scrape</button>
      <button onClick={handleAddSpotify}>Add Spotify</button>
    </>
  );
};
export default Refresh;
