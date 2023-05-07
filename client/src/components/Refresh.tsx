import { Box } from '@mui/material';
import axios from 'axios';
import { Festivals } from '../constants/enums';

const Refresh = () => {
  const handleExtract = (city: string) => {
    axios
      .get(import.meta.env.VITE_SITE_URL_DB + 'extract/', {
        params: {
          city: city,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleDropCollection = (collection: string) => {
    axios
      .get(import.meta.env.VITE_SITE_URL_DB + 'drop/', {
        params: {
          collectionName: collection,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleAddSpotify = (collection: string) => {
    axios
      .get(import.meta.env.VITE_SITE_URL_DB + 'spotify/', {
        params: {
          collectionName: collection,
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getTodaysDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    return mm + '-' + dd + '-' + yyyy;
  };

  return (
    <>
      <Box sx={{ marginBottom: '20px' }}>
        <button onClick={() => handleDropCollection('db_victoria_' + getTodaysDate())}>
          Drop db_victoria_{getTodaysDate()}
        </button>
        <button onClick={() => handleDropCollection('db_victoria_spotify')}>Drop db_victoria_spotify</button>
        <button onClick={() => handleExtract('victoria')}>Extract Victoria</button>
        <button onClick={() => handleAddSpotify('db_victoria_' + getTodaysDate())}>
          Add Spotify to db_victoria_{getTodaysDate()}
        </button>
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        <button onClick={() => handleDropCollection('db_vancouver_' + getTodaysDate())}>
          Drop db_vancouver_{getTodaysDate()}
        </button>
        <button onClick={() => handleDropCollection('db_vancouver_spotify')}>Drop db_vancouver_spotify</button>
        <button onClick={() => handleExtract('vancouver')}>Extract Vancouver</button>
        <button onClick={() => handleAddSpotify('db_vancouver_' + getTodaysDate())}>
          Add Spotify to db_vancouver_{getTodaysDate()}
        </button>
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        <button onClick={() => handleDropCollection('db_philipsBackyard_' + getTodaysDate())}>
          Drop db_philipsBackyard_{getTodaysDate()}
        </button>
        <button onClick={() => handleDropCollection('db_philipsBackyard_spotify')}>
          Drop db_philipsBackyard_spotify
        </button>
        <button onClick={() => handleExtract(Festivals.PhilipsBackyard)}>Extract Philips</button>
        <button onClick={() => handleAddSpotify(`db_${Festivals.PhilipsBackyard}_` + getTodaysDate())}>
          Add Spotify to db_{Festivals.PhilipsBackyard}_{getTodaysDate()}
        </button>
      </Box>
    </>
  );
};
export default Refresh;
