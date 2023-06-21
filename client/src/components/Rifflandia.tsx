import { Accordion, AccordionDetails, AccordionSummary, Box, Container } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button/Button';
import Typography from '@mui/material/Typography';
import { useContext, useEffect, useState } from 'react';
import spotifyIcon from '../spotifyLogos/Spotify_Icon_RGB_Black.png';
import { SnackBarContext } from '../App';
import useSpotifyAuth from '../hooks/useSpotifyAuth';
import { WEBSITE_RIFFLANDIA } from '../constants/locations';
import { AUTH_ENDPOINT, BASE_REDIRECT_URI, CLIENT_ID, SCOPES } from '../constants/auth';
import { TicketContainer } from './Rifflandia/TicketContainer';
import './styles/ClickMe.css';
import { RIFFLANDIA_COLOURS, RIFF_CARD_COLOURS } from './Rifflandia/colours';
import './Rifflandia/styles.css';
import TITLE from './Rifflandia/title.svg';
import { ReactComponent as CHERRIES } from './Rifflandia/cherries.svg';
import { Festivals } from '../constants/enums';
import { InAppModalRifflandia } from './Rifflandia/InAppModalRifflandia';
import { UseQueryOptions, useQuery } from 'react-query';
import { LoadingRifflandia } from './Rifflandia/LoadingRifflandia';
import { StickyButton } from './StickyButton';
import { Options } from './Rifflandia/Options';
import { Login } from './Rifflandia/Login';
import './Rifflandia/styles.css';
import { CreateNewPlaylistRifflandia, GetTicketsRifflandia } from './Rifflandia/API_Rifflandia';
import { SimpleAccordion } from './Rifflandia/SimpleAccordion';
import { SelectDays } from './Rifflandia/SelectDays';
import { useNavigate } from 'react-router-dom';

export const Rifflandia = () => {
  const { token, spotifyInfo } = useSpotifyAuth();
  const redirectUri = BASE_REDIRECT_URI + 'rifflandia';

  const navigate = useNavigate();
  const logOut = () => {
    localStorage.clear();
    navigate('/rifflandia');
    window.location.reload();
  };

  const DAYS = ['Sept 7', 'Sept 8', 'Sept 9', 'Sept 15', 'Sept 16', 'Sept 17'];

  const queryOptions: UseQueryOptions = {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    cacheTime: Infinity,
    keepPreviousData: true,
  };

  const loadInterval = 15;

  const [loadMore, setLoadMore] = useState(loadInterval);
  const [showLoadMoreBtn, setShowLoadMoreBtn] = useState(false);
  const [totalTickets, setTotalTickets] = useState<any>([]);
  const [tickets, setTickets] = useState<any>([]);

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [numTopTracks, setNumTopTracks] = useState(1);

  const query = useQuery({
    queryKey: [Festivals.Rifflandia],
    queryFn: GetTicketsRifflandia,
    ...queryOptions,
  });

  const [showSelectDays, setShowSelectDays] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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

  const handleNumTopTracks = (event: any) => {
    setNumTopTracks(event.target.value);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleCloseSelectDays = () => {
    setShowSelectDays(false);
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
      await CreateNewPlaylistRifflandia({
        token: token,
        user_id: spotifyInfo.user_id,
        numTopTracks: numTopTracks,
        //days: selectedDays,
        days: selectedDays,
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

  const handleClearAllFilters = () => {
    setLoadMore(loadInterval);
    setTickets(totalTickets.slice(0, loadMore));
    setShowLoadMoreBtn(true);
  };

  const handleDayClick = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((selectedDay) => selectedDay !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  useEffect(() => {
    if (!selectedDays || selectedDays.length === 0) {
      handleClearAllFilters();
    } else {
      const tickets = totalTickets.filter((ticket: any) => {
        return selectedDays.some((day: any) => ticket.day.includes(day));
      });
      setTickets(tickets);
      setShowLoadMoreBtn(false);
    }
  }, [selectedDays]);

  useEffect(() => {
    if (loadMore < totalTickets.length) {
      setShowLoadMoreBtn(true);
    } else {
      setShowLoadMoreBtn(false);
    }
  }, [totalTickets, loadMore]);

  if (isLoadingTickets || query.isLoading || query.isFetching || query.isRefetching) {
    return <LoadingRifflandia />;
  }

  if (!token || !spotifyInfo || !spotifyInfo.access) {
    return <Login />;
  }

  return (
    <>
      <div className="sidebar sidebar-svg-park"></div>
      <div className="sidebar sidebar-svg-electric"></div>

      <Box
        className="riff-background"
        sx={{
          textAlign: 'center',
          paddingBottom: '24px',
          backgroundColor: RIFFLANDIA_COLOURS.background,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ maxWidth: '900px' }}>
            <Container
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
                paddingBottom: !showLoadMoreBtn ? '120px' : '',
              }}
            >
              <Box
                sx={{
                  backgroundColor: RIFFLANDIA_COLOURS.background,
                  borderRadius: '10px',
                  width: '300px',
                  margin: '8px',
                }}
              >
                <img src={TITLE} alt="Rifflandia Title" />

                <Button
                  onClick={handleCreatePlaylist}
                  variant="contained"
                  className="btn--click-me-riff create-playlist"
                  sx={{
                    backgroundColor: RIFFLANDIA_COLOURS.light_blue,
                    ':hover': {
                      backgroundColor: RIFFLANDIA_COLOURS.dark_blue,
                    },
                    color: 'black',
                    width: '300px',
                    marginTop: '16px',
                    marginBottom: '16px',
                    justifyContent: 'center',
                    height: '48px',
                  }}
                >
                  <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} />
                  <Typography sx={{ paddingBottom: 0 }}>Generate playlist</Typography>
                </Button>
              </Box>

              {/* <Button
              variant="outlined"
              sx={{ marginTop: '16px', width: '300px' }}
              onClick={() => {
                setShowSelectDays(!showSelectDays);
              }}
            >
              Filter by day
            </Button> */}

              {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              {DAYS.map((day) => (
                <Button
                  variant="outlined"
                  key={day}
                  onClick={() => handleDayClick(day)}
                  sx={{
                    width: '90px',
                    fontSize: '0.6rem',
                    margin: '8px 0px',
                    marginBottom: '2px',
                    background: selectedDays.includes(day) ? RIFFLANDIA_COLOURS.fill_light_orange : 'none',
                    // '&:active': {
                    //   background: RIFFLANDIA_COLOURS.fill_light_orange,
                    // },
                    // '&:focus': {
                    //   background: RIFFLANDIA_COLOURS.fill_light_orange,
                    // },
                    '&:hover': {
                      background: selectedDays.includes(day) ? RIFFLANDIA_COLOURS.fill_light_orange : 'none',
                    },
                  }}
                >
                  {day}
                </Button>
              ))}
            </Box> */}

              <Box
                sx={{
                  backgroundColor: RIFFLANDIA_COLOURS.background,
                  borderRadius: '10px',
                  width: '300px',
                  margin: '8px',
                }}
              >
                <Button
                  variant="outlined"
                  sx={{ marginBottom: '16px', width: '300px' }}
                  onClick={() => {
                    setShowSettings(!showSettings);
                  }}
                >
                  Customize
                </Button>

                <Button
                  variant="outlined"
                  sx={{ marginBottom: '16px', width: '300px' }}
                  onClick={() => {
                    logOut();
                  }}
                >
                  Sign out
                </Button>

                <Button variant="outlined" sx={{ width: '300px' }} href={WEBSITE_RIFFLANDIA} target="_blank">
                  <Box sx={{ marginRight: '12px', height: '20px', width: '20px' }}>
                    <CHERRIES />
                  </Box>
                  Buy Tickets
                </Button>
              </Box>

              {/* <Box sx={{ display: 'flex' }}>
              <Button
                variant="outlined"
                sx={{ marginRight: '18px', width: '140px' }}
                href={WEBSITE_RIFFLANDIA}
                target="_blank"
              >
                <Box sx={{ marginRight: '12px', height: '20px', width: '20px' }}>
                  <CHERRIES />
                </Box>
                Tickets
              </Button>

              <Button
                variant="outlined"
                sx={{ width: '140px' }}
                onClick={() => {
                  setShowSettings(!showSettings);
                }}
              >
                Options
              </Button>
            </Box> */}

              {showSelectDays && (
                <div>
                  <SelectDays
                    selectedDays={selectedDays}
                    handleDayClick={handleDayClick}
                    handleCloseSelectDays={handleCloseSelectDays}
                    colour={RIFFLANDIA_COLOURS.fill_pale_green}
                  />
                </div>
              )}

              {showSettings && (
                <div>
                  <Options
                    selectedDays={selectedDays}
                    handleDayClick={handleDayClick}
                    handleCloseSelectDays={handleCloseSelectDays}
                    totalTickets={totalTickets}
                    numTopTracks={numTopTracks}
                    handleNumTopTracks={handleNumTopTracks}
                    handleCloseSettings={handleCloseSettings}
                    colour={RIFFLANDIA_COLOURS.fill_pale_green}
                  />
                </div>
              )}

              {/* <Box sx={{ textAlign: 'center', paddingBottom: '24px' }}>
          <Container sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}> */}
              <TicketContainer
                tickets={tickets}
                showGenres={false}
                isLoadingTickets={false}
                isErrorTickets={isErrorTickets}
                cardColours={RIFF_CARD_COLOURS}
              />
            </Container>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {showLoadMoreBtn && (
            <Button
              variant="outlined"
              sx={{ marginTop: '24px', marginBottom: '120px' }}
              onClick={() => {
                setLoadMore(loadMore + loadInterval);
              }}
            >
              Load more
            </Button>
          )}
        </Box>
      </Box>

      <StickyButton
        handleCreatePlaylist={handleCreatePlaylist}
        backgroundColor={RIFFLANDIA_COLOURS.light_blue}
        hoverColor={RIFFLANDIA_COLOURS.dark_blue}
        barColor={RIFFLANDIA_COLOURS.fill_light_orange}
      />

      <InAppModalRifflandia open={open} handleClose={handleClose} handleRedirectToAuth={handleRedirectToAuth} />
    </>
  );
};
