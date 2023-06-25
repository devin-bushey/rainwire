import { useContext, useEffect, useState } from 'react';

import '../styles/ClickMe.css';
import './styles.css';

// Images
import TITLE from './images/title.svg';
import { ReactComponent as CHERRIES } from './images/cherries.svg';
import spotifyIcon from '../../spotifyLogos/Spotify_Icon_RGB_Black.png';

import { Box, Container } from '@mui/material';
import Button from '@mui/material/Button/Button';
import Typography from '@mui/material/Typography';

import { SnackBarContext } from '../../App';
import useSpotifyAuth from '../../hooks/useSpotifyAuth';
import { WEBSITE_RIFFLANDIA } from '../../constants/locations';
import { AUTH_ENDPOINT, BASE_REDIRECT_URI, CLIENT_ID, SCOPES } from '../../constants/auth';
import { TicketContainer } from './TicketContainer';
import { RIFFLANDIA_COLOURS, RIFF_CARD_COLOURS } from './colours';

import { Festivals } from '../../constants/enums';
import { InAppModalRifflandia } from './InAppModalRifflandia';
import { UseQueryOptions, useQuery } from 'react-query';
import { LoadingRifflandia } from './LoadingRifflandia';
import { StickyButton } from '../StickyButton';
import { Options } from './Options';
import { Login } from './Login';

import { CreateNewPlaylistRifflandia, GetTicketsRifflandia } from './API_Rifflandia';
import { SelectDays } from './SelectDays';
import { useNavigate } from 'react-router-dom';
import { Spinner } from './Spinner';
import { sortByOrderNum, sortDataByDateAndOrder } from '../../helpers/sorter';
import { trackButtonClick } from '../../hooks/ga4';

export const Rifflandia = () => {
  const { token, spotifyInfo } = useSpotifyAuth();
  const redirectUri = BASE_REDIRECT_URI + 'rifflandia';

  const navigate = useNavigate();
  const logOut = () => {
    localStorage.clear();
    navigate('/rifflandia');
    window.location.reload();
  };

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

  const [isLoading, setIsLoading] = useState(false);
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
      setTotalTickets(sortByOrderNum(query.data));
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
      setIsLoading(true);
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

      setIsLoading(false);
    } else {
      isInAppBrowser();
    }
  };

  const handleClearAllFilters = () => {
    setLoadMore(loadInterval);
    setTotalTickets(sortByOrderNum(totalTickets));
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

  const handleBuyTickets = () => {
    window.open(WEBSITE_RIFFLANDIA);
    //window.location.assign(WEBSITE_RIFFLANDIA);
    trackButtonClick();
  };

  useEffect(() => {
    if (!selectedDays || selectedDays.length === 0) {
      handleClearAllFilters();
    } else {
      const sortedTickets = sortDataByDateAndOrder(totalTickets);
      setTotalTickets(sortedTickets);
      const tickets = sortedTickets.filter((ticket: any) => {
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

      {isLoading && <Spinner />}

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

                <Button className="buy_tickets" onClick={handleBuyTickets} variant="outlined" sx={{ width: '300px' }}>
                  <Box sx={{ marginRight: '12px', height: '20px', width: '20px' }}>
                    <CHERRIES />
                  </Box>
                  Buy Tickets
                </Button>
              </Box>

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
