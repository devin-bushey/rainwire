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

  const handleExtractRifflandia = () => {
    axios
      .get(import.meta.env.VITE_SITE_URL_DB + 'rifflandia-extract/')
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleAddSpotifyRifflandia = () => {
    axios
      .get(import.meta.env.VITE_SITE_URL_DB + 'rifflandia-spotify/')
      .then((response) => {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <Box sx={{ marginBottom: '20px' }}>
        <button onClick={() => handleDropCollection('victoria_simple')}>Drop victoria_simple</button>
        <button onClick={() => handleDropCollection('victoria')}>Drop victoria</button>
        <button onClick={() => handleExtract('victoria')}>Extract Victoria</button>
        <button onClick={() => handleAddSpotify('victoria')}>Add Spotify to victoria_simple</button>
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        <button onClick={() => handleDropCollection('vancouver_simple')}>Drop vancouver_simple</button>
        <button onClick={() => handleDropCollection('vancouver')}>Drop vancouver</button>
        <button onClick={() => handleExtract('vancouver')}>Extract Vancouver</button>
        <button onClick={() => handleAddSpotify('vancouver')}>Add Spotify to vancouver_simple</button>
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        <button onClick={() => handleDropCollection('phillipsBackyard_simple')}>Drop philipsBackyard_simple</button>
        <button onClick={() => handleDropCollection('phillipsBackyard')}>Drop philipsBackyard</button>
        <button onClick={() => handleExtract(Festivals.PhilipsBackyard)}>Extract Philips</button>
        <button onClick={() => handleAddSpotify(`${Festivals.PhilipsBackyard}`)}>
          Add Spotify to {Festivals.PhilipsBackyard}_simple
        </button>
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        <button onClick={() => handleDropCollection(`db_${Festivals.LaketownShakedown}`)}>
          Drop db_{Festivals.LaketownShakedown}
        </button>
        <button onClick={() => handleDropCollection(`db_${Festivals.LaketownShakedown}_sp`)}>
          Drop db_{Festivals.LaketownShakedown}_sp
        </button>
        <button onClick={() => handleExtract(Festivals.LaketownShakedown)}>
          Extract {Festivals.LaketownShakedown}
        </button>
        <button onClick={() => handleAddSpotify(`db_${Festivals.LaketownShakedown}`)}>
          Add Spotify to db_{Festivals.LaketownShakedown}
        </button>
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        <button onClick={() => handleDropCollection(`${Festivals.Osheaga}_simple`)}>
          Drop {Festivals.Osheaga}_simple
        </button>
        <button onClick={() => handleDropCollection(`${Festivals.Osheaga}`)}>Drop {Festivals.Osheaga}</button>
        <button onClick={() => handleExtract(Festivals.Osheaga)}>Extract {Festivals.Osheaga}</button>
        <button onClick={() => handleAddSpotify(Festivals.Osheaga)}>Add Spotify to {Festivals.Osheaga}</button>
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        <button onClick={() => handleDropCollection(`db_${Festivals.Coachella}`)}>Drop db_{Festivals.Coachella}</button>
        <button onClick={() => handleDropCollection(`db_${Festivals.Coachella}_sp`)}>
          Drop db_{Festivals.Coachella}_sp
        </button>
        <button onClick={() => handleExtract(Festivals.Coachella)}>Extract {Festivals.Coachella}</button>
        <button onClick={() => handleAddSpotify(`db_${Festivals.Coachella}`)}>
          Add Spotify to db_{Festivals.Coachella}
        </button>
      </Box>

      {/* <Box sx={{ marginBottom: '20px' }}>
        <button onClick={() => handleDropCollection(`db_${Festivals.Rifflandia}`)}>
          Drop db_{Festivals.Rifflandia}
        </button>
        <button onClick={() => handleDropCollection(`db_${Festivals.Rifflandia}_sp`)}>
          Drop db_{Festivals.Rifflandia}_sp
        </button>
        <button onClick={() => handleExtract(Festivals.Rifflandia)}>Extract {Festivals.Rifflandia}</button>
        <button onClick={() => handleAddSpotify(`db_${Festivals.Rifflandia}`)}>
          Add Spotify to db_{Festivals.Rifflandia}
        </button>
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        <button onClick={() => handleDropCollection(`rifflandia_simple`)}>Drop rifflandia_simple</button>
        <button onClick={() => handleDropCollection(`rifflandia`)}>Drop rifflandia</button>
        <button onClick={() => handleExtractRifflandia()}>Extract rifflandia_simple</button>
        <button onClick={() => handleAddSpotifyRifflandia()}>Add Spotify to rifflandia_simple</button>
      </Box> */}
    </>
  );
};
export default Refresh;
