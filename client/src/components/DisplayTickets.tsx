import { Box, Container } from '@mui/material';
import Button from '@mui/material/Button/Button';
import Typography from '@mui/material/Typography';
import { COLOURS } from '../theme/AppStyles';
import { useContext, useEffect, useState } from 'react';
import spotifyIcon from '../spotifyLogos/Spotify_Icon_RGB_Black.png';
import { CreateNewPlaylist } from '../apiManager/Spotify';
import { Cities, Festivals } from '../constants/enums';
import { SnackBarContext } from '../App';
import useSpotifyAuth from '../hooks/useSpotifyAuth';
import useTicketQueries from '../hooks/useTicketQueries';
import {
  WEBSITE_VICTORIA,
  WEBSITE_VANCOUVER,
  WEBSITE_PHILIPS,
  WEBSITE_WHISTLE,
  WEBSITE_LAKETOWN,
  WEBSITE_OSHEAGA,
  WEBSITE_COACHELLA,
  WEBSITE_RIFFLANDIA,
  LOCATIONS,
} from '../constants/locations';
import { AUTH_ENDPOINT, BASE_REDIRECT_URI, CLIENT_ID, SCOPES } from '../constants/auth';
import { Origin } from './Origin';
import { Settings } from './Settings';
import { TicketContainer } from './TicketContainer';

export const DisplayTickets = (data: any) => {
  const { token, spotifyInfo } = useSpotifyAuth();
  const redirectUri = BASE_REDIRECT_URI + 'tickets/';

  const {
    rifflandiaQuery,
    victoriaQuery,
    vancouverQuery,
    philipsQuery,
    whistleQuery,
    laketownQuery,
    osheagaQuery,
    coachellaQuery,
  } = useTicketQueries();

  const loadInterval = 15;

  const [loadMore, setLoadMore] = useState(loadInterval);
  const [totalTickets, setTotalTickets] = useState<any>(data.tickets);
  const [tickets, setTickets] = useState<any>(totalTickets.slice(0, loadMore));

  const [filteredGenres, setFilteredGenres] = useState<any>([]);
  const [numTopTracks, setNumTopTracks] = useState(1);

  const [showSettings, setShowSettings] = useState(false);
  const [showGenres, setShowGenres] = useState(false);

  const [origin, setOrigin] = useState(LOCATIONS[0].value);
  const [query, setQuery] = useState(philipsQuery);
  const [website, setWebsite] = useState(LOCATIONS[0].website);

  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [isErrorTickets, setIsErrorTickets] = useState(false);

  const [isError, setIsError] = useState(false);
  const snackBar = useContext(SnackBarContext);

  useEffect(() => {
    setTotalTickets(data.tickets);
  }, [data.tickets]);

  useEffect(() => {
    setFilteredGenres([]);
    const queries: any = {
      [Cities.Victoria]: { query: victoriaQuery, website: WEBSITE_VICTORIA },
      [Cities.Vancouver]: { query: vancouverQuery, website: WEBSITE_VANCOUVER },
      [Festivals.PhilipsBackyard]: { query: philipsQuery, website: WEBSITE_PHILIPS },
      [Festivals.Whistlemania]: { query: whistleQuery, website: WEBSITE_WHISTLE },
      [Festivals.LaketownShakedown]: { query: laketownQuery, website: WEBSITE_LAKETOWN },
      [Festivals.Osheaga]: { query: osheagaQuery, website: WEBSITE_OSHEAGA },
      [Festivals.Coachella]: { query: coachellaQuery, website: WEBSITE_COACHELLA },
      [Festivals.Rifflandia]: { query: rifflandiaQuery, website: WEBSITE_RIFFLANDIA },
    };

    const { query: newQuery, website: newWebsite } = queries[origin];
    setQuery(newQuery);
    setWebsite(newWebsite);
  }, [origin]);

  useEffect(() => {
    if (!query.data) {
      query.refetch();
    }

    if (query.data) {
      setLoadMore(loadInterval);
      setTotalTickets(query.data);
      setTickets(query.data);
      setIsLoadingTickets(false);
      setIsErrorTickets(false);
    } else if (query.isFetching || query.isLoading) {
      setIsLoadingTickets(true);
    } else if (query.error) {
      setIsErrorTickets(true);
    }
  }, [query]);

  useEffect(() => {
    if (filteredGenres === undefined || filteredGenres.length === 0) {
      setShowGenres(false);
      setLoadMore(loadInterval);
      setTickets(totalTickets.slice(0, loadMore));
      return;
    }

    const filteredTickets = totalTickets.filter((ticket: any) => {
      if (!ticket?.genres) return false;
      return ticket.genres.some((genre: any) => filteredGenres.includes(genre));
    });

    setShowGenres(filteredTickets.length > 0);
    setTickets(filteredTickets);
  }, [filteredGenres]);

  useEffect(() => {
    if (isError) {
      snackBar.setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: 'Error creating playlist. Please try again.',
        isError: true,
      });
      setIsError(false);
    }
  }, [isError]);

  useEffect(() => {
    setTickets(totalTickets.slice(0, loadInterval));
    setLoadMore(loadInterval);
  }, [totalTickets]);

  useEffect(() => {
    setTickets(totalTickets.slice(0, loadMore));
  }, [loadMore]);

  const handleDeleteGenre = (genre: string) => () => {
    setFilteredGenres((value: any) => value?.filter((v: any) => v !== genre));
  };

  const handleFilteredGenres = (event: any) => {
    const genres = event.target.value;
    setFilteredGenres(genres);
  };

  const handleChangeOrigin = (event: any) => {
    setOrigin(event.target.value);
  };

  const handleNumTopTracks = (event: any) => {
    setNumTopTracks(event.target.value);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleCreatePlaylist = async () => {
    if (token && spotifyInfo.access) {
      await CreateNewPlaylist({
        city: origin,
        token: token,
        user_id: spotifyInfo.user_id,
        numTopTracks: numTopTracks,
        tickets: filteredGenres.length > 0 ? tickets : null,
      })
        .then((res) => {
          if (res.status === 201) {
            snackBar.setSnackBar({
              showSnackbar: true,
              setShowSnackbar: () => true,
              message: 'Successfully created a playlist!',
              isError: false,
            });
            window.location.assign(res.data);
          } else {
            setIsError(true);
          }
        })
        .catch((err) => {
          setIsError(true);
        });
    } else {
      location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=${SCOPES.join(
        '%20',
      )}&response_type=token&show_dialog=true`;
    }
  };

  return (
    <Box sx={{ textAlign: 'center', paddingBottom: '24px' }}>
      <Typography variant="h5" sx={{ color: COLOURS.black, textAlign: 'center', marginBottom: '8px' }}>
        Preview artists playing in
      </Typography>

      <Origin origin={origin} handleChangeOrigin={handleChangeOrigin} />

      <Button
        onClick={handleCreatePlaylist}
        variant="contained"
        color="secondary"
        sx={{ width: '310px', marginTop: '8px', justifyContent: 'center' }}
      >
        <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} />
        <Typography sx={{ paddingBottom: 0 }}>Create playlist</Typography>
      </Button>

      <Box display={'flex'} justifyContent={'center'}>
        {website && (
          <Button
            variant="outlined"
            sx={{ marginTop: '12px', marginBottom: '24px', marginRight: '18px', width: '145px' }}
            href={website}
            target="_blank"
          >
            Get Tickets
          </Button>
        )}
        <Button
          variant="outlined"
          sx={{ marginTop: '12px', marginBottom: '24px', width: '145px' }}
          onClick={() => {
            setShowSettings(!showSettings);
          }}
        >
          Settings
        </Button>
      </Box>

      {showSettings && (
        <Settings
          totalTickets={totalTickets}
          filteredGenres={filteredGenres}
          numTopTracks={numTopTracks}
          handleFilteredGenres={handleFilteredGenres}
          handleNumTopTracks={handleNumTopTracks}
          handleDeleteGenre={handleDeleteGenre}
          handleCloseSettings={handleCloseSettings}
        />
      )}

      <Container sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        <TicketContainer
          tickets={tickets}
          showGenres={showGenres}
          isLoadingTickets={isLoadingTickets}
          isErrorTickets={isErrorTickets}
        />
      </Container>
      {filteredGenres.length === 0 && loadMore < totalTickets.length && (
        <Button
          variant="outlined"
          sx={{ marginTop: '24px' }}
          onClick={() => {
            setLoadMore(loadMore + loadInterval);
          }}
        >
          Load more
        </Button>
      )}
    </Box>
  );
};
