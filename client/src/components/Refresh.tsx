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

      <Box sx={{ marginBottom: '20px' }}>
        <button onClick={() => handleAddSpotify(`db_${Festivals.Whistlemania}_05-08-2023`)}>
          Add Spotify to db_{Festivals.Whistlemania}_05-08-2023
        </button>
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        <button onClick={() => handleDropCollection(`db_${Festivals.LaketownShakedown}_` + getTodaysDate())}>
          Drop db_{Festivals.LaketownShakedown}_{getTodaysDate()}
        </button>
        <button onClick={() => handleDropCollection(`db_${Festivals.LaketownShakedown}_spotify`)}>
          Drop db_{Festivals.LaketownShakedown}_spotify
        </button>
        <button onClick={() => handleExtract(Festivals.LaketownShakedown)}>
          Extract {Festivals.LaketownShakedown}
        </button>
        <button onClick={() => handleAddSpotify(`db_${Festivals.LaketownShakedown}_` + getTodaysDate())}>
          Add Spotify to db_{Festivals.LaketownShakedown}_{getTodaysDate()}
        </button>
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        <button onClick={() => handleDropCollection(`db_${Festivals.Osheaga}_` + getTodaysDate())}>
          Drop db_{Festivals.Osheaga}_{getTodaysDate()}
        </button>
        <button onClick={() => handleDropCollection(`db_${Festivals.Osheaga}_spotify`)}>
          Drop db_{Festivals.Osheaga}_spotify
        </button>
        <button onClick={() => handleExtract(Festivals.Osheaga)}>Extract {Festivals.Osheaga}</button>
        <button onClick={() => handleAddSpotify(`db_${Festivals.Osheaga}_` + getTodaysDate())}>
          Add Spotify to db_{Festivals.Osheaga}_{getTodaysDate()}
        </button>
      </Box>
    </>
  );
};
export default Refresh;
