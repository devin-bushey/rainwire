import { Box, Container } from '@mui/material';
import Button from '@mui/material/Button/Button';
import Typography from '@mui/material/Typography';
import { COLOURS } from '../theme/AppStyles';
import { useContext, useEffect, useState } from 'react';
import spotifyIcon from '../spotifyLogos/Spotify_Icon_RGB_Black.png';
import { CreateNewPlaylist } from '../apiManager/Spotify';
import { SnackBarContext } from '../App';
import useSpotifyAuth from '../hooks/useSpotifyAuth';
import { LOCATIONS } from '../constants/locations';
import { AUTH_ENDPOINT, BASE_REDIRECT_URI, CLIENT_ID, SCOPES } from '../constants/auth';
import { Origin } from './Origin';
import { Settings } from './Settings';
import { TicketContainer } from './TicketContainer';
import './styles/ClickMe.css';
import { InAppModal } from './InAppModal';
import { ScrollButton } from './ScrollButton';
import { UseQueryOptions, useQuery } from 'react-query';
import { GetTickets } from '../apiManager/RecordShop';
import { Loading } from './Loading';

export const DisplayTickets = () => {
  const queryOptions: UseQueryOptions = {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    cacheTime: Infinity,
    keepPreviousData: true,
  };

  const { token, spotifyInfo } = useSpotifyAuth();
  const redirectUri = BASE_REDIRECT_URI + 'tickets/';

  const [origin, setOrigin] = useState(LOCATIONS[0].value);

  const query = useQuery({
    queryKey: [origin, { origin }],
    queryFn: GetTickets,
    ...queryOptions,
  });

  const loadInterval = 10;

  const [loadMore, setLoadMore] = useState(loadInterval);
  const [totalTickets, setTotalTickets] = useState<any>([]);
  const [tickets, setTickets] = useState<any>([]);

  const [filteredGenres, setFilteredGenres] = useState<any>([]);
  const [numTopTracks, setNumTopTracks] = useState(1);

  const [showSettings, setShowSettings] = useState(false);
  const [showGenres, setShowGenres] = useState(false);

  const [website, setWebsite] = useState(LOCATIONS[0].website);

  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [isErrorTickets, setIsErrorTickets] = useState(false);

  const [isError, setIsError] = useState(false);
  const snackBar = useContext(SnackBarContext);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (query.data) {
      setIsLoadingTickets(false);
      setIsErrorTickets(false);
    } else if (query.isFetching || query.isLoading) {
      setIsLoadingTickets(true);
    } else if (query.error) {
      setIsErrorTickets(true);
    }
  }, [query]);

  useEffect(() => {
    if (query.data) {
      setLoadMore(loadInterval);
      setTotalTickets(query.data);
    }
  }, [query.data]);

  useEffect(() => {
    setFilteredGenres([]);

    LOCATIONS.map((location) => {
      if (location.value === origin) {
        setWebsite(location.website);
        return;
      }
    });
  }, [origin]);

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

  const handleClearGenres = () => {
    setFilteredGenres([]);
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

  const isInAppBrowser = () => {
    // check if this react app is open within Instagram, LinkedIn, or Facebook's in-app browser
    if (navigator.userAgent.match(/FBAN|FBAV|Instagram|LinkedIn|Messenger/i)) {
      // in-app browser detected
      handleOpen();
      return true;
    }
    handleRedirectToAuth();
    return false;
  };

  const handleRedirectToAuth = () => {
    location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=${SCOPES.join(
      '%20',
    )}&response_type=token&show_dialog=true`;
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
          console.log(err);
          setIsError(true);
        });
    } else {
      isInAppBrowser();
    }
  };

  if (isLoadingTickets) {
    return <Loading />;
  }

  return (
    <>
      <Box className="" sx={{ textAlign: 'center', paddingBottom: '24px' }}>
        <Container sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
          <Box
            sx={{
              //backgroundColor: COLOURS.accent_02,
              borderRadius: '10px',
              //padding: '30px',
              //marginBottom: '20px',
              width: '300px',
              margin: '8px',
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontSize: '1.4rem', color: COLOURS.black, textAlign: 'center', marginBottom: '16px' }}
            >
              Create a new playlist
            </Typography>

            <Origin origin={origin} handleChangeOrigin={handleChangeOrigin} />

            <Button
              onClick={handleCreatePlaylist}
              variant="contained"
              color="secondary"
              className="btn--click-me create-playlist"
              sx={{ width: '300px', marginTop: '24px', justifyContent: 'center' }}
            >
              <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} />
              <Typography sx={{ paddingBottom: 0 }}>Create playlist</Typography>
            </Button>

            <Button
              variant="outlined"
              sx={{ marginTop: '12px', marginBottom: '24px', width: '300px' }}
              onClick={() => {
                setShowSettings(!showSettings);
              }}
            >
              Options
            </Button>

            {website && (
              <Button
                variant="outlined"
                sx={{ marginBottom: '12px', marginRight: '18px', width: '300px' }}
                href={website}
                target="_blank"
              >
                Tickets
              </Button>
            )}
          </Box>

          {showSettings && (
            <div>
              <Settings
                totalTickets={totalTickets}
                filteredGenres={filteredGenres}
                numTopTracks={numTopTracks}
                handleFilteredGenres={handleFilteredGenres}
                handleNumTopTracks={handleNumTopTracks}
                handleDeleteGenre={handleDeleteGenre}
                handleCloseSettings={handleCloseSettings}
                handleClearGenres={handleClearGenres}
              />
            </div>
          )}

          <TicketContainer
            tickets={tickets}
            showGenres={showGenres}
            isLoadingTickets={isLoadingTickets}
            isErrorTickets={isErrorTickets}
          />
        </Container>
        {totalTickets && filteredGenres.length === 0 && loadMore < totalTickets.length && (
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

      <ScrollButton />

      <InAppModal open={open} handleClose={handleClose} handleRedirectToAuth={handleRedirectToAuth} />
    </>
  );
};
