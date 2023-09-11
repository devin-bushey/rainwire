import { Box, Container, TextField } from '@mui/material';
import Button from '@mui/material/Button/Button';
import Typography from '@mui/material/Typography';
import { COLOURS } from '../theme/AppStyles';
import { useContext, useEffect, useState } from 'react';
import spotifyIcon from '../spotifyLogos/Spotify_Icon_RGB_Black.png';
import { SnackBarContext } from '../App';
import useSpotifyAuth from '../hooks/useSpotifyAuth';
import { LOCATIONS } from '../constants/locations';
import { AUTH_ENDPOINT, BASE_REDIRECT_URI, CLIENT_ID, SCOPES } from '../constants/auth';
import { Origin } from '../components/Origin';
import { Settings } from '../components/Settings';
import { TicketContainer } from '../components/TicketContainer';
import { InAppModal } from '../components/InAppModal';
import { UseQueryOptions, useQuery } from 'react-query';
import { CreateNewPlaylist, CreateNewPlaylistJamBase, GetJamBase, GetTickets } from '../apiManager/RecordShop';
import { Loading } from './Loading';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../Rifflandia/Spinner';
import { sortByOrderNum } from '../utils/sorter';
import { StickyButton } from '../components/StickyButton';
import { SignInModalRifflandia } from '../Rifflandia/SignInModalRifflandia';
import { JamBaseTicketContainer } from '../components/JamBaseTicketContainer';

export const JamBase = () => {
  const queryOptions: UseQueryOptions = {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    cacheTime: Infinity,
    keepPreviousData: true,
  };

  const { token, spotifyInfo } = useSpotifyAuth();
  const redirectUri = BASE_REDIRECT_URI + 'artists';

  const [openSignIn, setOpenSignIn] = useState(false);
  const handleOpenSignIn = () => setOpenSignIn(true);
  const handleCloseSignIn = () => setOpenSignIn(false);

  const [origin, setOrigin] = useState(LOCATIONS[0].value);

  const query = useQuery({
    queryKey: [`${origin}_jb`, { origin }],
    queryFn: GetJamBase,
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

  const [isLoading, setIsLoading] = useState(false);

  const [isShaking, setIsShaking] = useState(false);

  const [isError, setIsError] = useState(false);
  const snackBar = useContext(SnackBarContext);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    document.title = 'Record Shop | Artists';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setIsShaking(true);

    // Reset the shaking animation after a delay
    setTimeout(() => {
      setIsShaking(false);
    }, 2000);
  }, []);

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
      setIsLoading(true);
      await CreateNewPlaylistJamBase({
        //city: origin,
        city: origin,
        token: token,
        user_id: spotifyInfo.user_id,
        numTopTracks: numTopTracks,
        //tickets: filteredGenres.length > 0 ? tickets : null,
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
      setIsLoading(false);
    } else {
      handleOpenSignIn();
      //isInAppBrowser();
    }
  };

  const navigate = useNavigate();
  const logOut = () => {
    if (token && spotifyInfo.access) {
      localStorage.clear();
      navigate('/');
      window.location.reload();
    } else {
      isInAppBrowser();
    }
  };

  const onKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      console.log('Input value', e.target.value);
      setOrigin(e.target.value);
      e.preventDefault();
    }
  };

  if (isLoadingTickets) {
    return <Loading />;
  }

  return (
    <>
      {isLoading && <Spinner />}
      <Box sx={{ marginTop: '-24px', textAlign: 'center', paddingBottom: '125px' }}>
        <Typography
          sx={{
            fontSize: '4rem',
            fontFamily: 'Lobster, Arial, sans-serif',
            letterSpacing: '2px',
            marginBottom: '12px',
          }}
        >
          Record Shop
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ maxWidth: '900px' }}>
            <Container sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
              <Box
                sx={{
                  borderRadius: '10px',
                  width: '300px',
                  margin: '8px',
                }}
              >
                {/* <Origin origin={origin} handleChangeOrigin={handleChangeOrigin} /> */}

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ minWidth: '300px' }}>
                    <TextField fullWidth id="outlined-basic" label={origin} variant="outlined" onKeyDown={onKeyPress} />
                  </Box>
                </Box>
                <Button
                  onClick={handleCreatePlaylist}
                  variant="contained"
                  className={`${isShaking ? 'shaking' : ''}`}
                  sx={{
                    backgroundColor: COLOURS.blue,
                    ':hover': {
                      backgroundColor: COLOURS.card_colours[1],
                    },
                    color: 'black',
                    width: '300px',
                    marginTop: '24px',
                    marginBottom: '16px',
                    justifyContent: 'center',
                    height: '48px',
                  }}
                >
                  <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} />
                  <Typography sx={{ paddingBottom: 0 }}>Create playlist</Typography>
                </Button>
              </Box>

              <Box
                sx={{
                  borderRadius: '10px',
                  width: '300px',
                  margin: '8px',
                }}
              >
                <Button
                  variant="outlined"
                  sx={{ marginBottom: '12px', width: '300px' }}
                  onClick={() => {
                    setShowSettings(!showSettings);
                  }}
                >
                  Customize
                </Button>

                <Button
                  variant="outlined"
                  sx={{ marginBottom: '12px', width: '300px' }}
                  onClick={() => {
                    logOut();
                  }}
                >
                  {token && spotifyInfo.access ? 'Sign out' : 'Sign in'}
                </Button>

                {website && (
                  <Button
                    variant="outlined"
                    sx={{ marginBottom: '12px', marginRight: '18px', width: '300px' }}
                    href={website}
                    target="_blank"
                  >
                    Buy Tickets
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

              <JamBaseTicketContainer
                tickets={tickets}
                showGenres={showGenres}
                isLoadingTickets={isLoadingTickets}
                isErrorTickets={isErrorTickets}
              />
            </Container>
          </Box>
        </Box>
        {totalTickets && filteredGenres.length === 0 && loadMore < totalTickets.length && (
          <Button
            variant="outlined"
            sx={{ marginTop: '24px', marginBottom: '32px' }}
            onClick={() => {
              setLoadMore(loadMore + loadInterval);
            }}
          >
            Load more
          </Button>
        )}
      </Box>

      <StickyButton
        handleCreatePlaylist={handleCreatePlaylist}
        backgroundColor={COLOURS.blue}
        hoverColor={COLOURS.card_colours[1]}
        barColor={COLOURS.card_colours[2]}
      />

      <SignInModalRifflandia open={openSignIn} handleClose={handleCloseSignIn} handleRedirectToAuth={isInAppBrowser} />

      <InAppModal open={open} handleClose={handleClose} handleRedirectToAuth={handleRedirectToAuth} />
    </>
  );
};
