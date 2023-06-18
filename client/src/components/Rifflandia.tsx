import { Box, Container } from '@mui/material';
import Button from '@mui/material/Button/Button';
import Typography from '@mui/material/Typography';
import { useContext, useEffect, useState } from 'react';
import spotifyIcon from '../spotifyLogos/Spotify_Icon_RGB_Black.png';
import { CreateNewPlaylist } from '../apiManager/Spotify';
import { SnackBarContext } from '../App';
import useSpotifyAuth from '../hooks/useSpotifyAuth';
import { WEBSITE_RIFFLANDIA } from '../constants/locations';
import { AUTH_ENDPOINT, BASE_REDIRECT_URI, CLIENT_ID, SCOPES } from '../constants/auth';
import { TicketContainer } from './TicketContainer';
import './styles/ClickMe.css';
import { RIFFLANDIA_COLOURS, RIFF_CARD_COLOURS } from './Rifflandia/colours';
import './Rifflandia/styles.css';
import TITLE from './Rifflandia/title.svg';
import { ReactComponent as CHERRIES } from './Rifflandia/cherries.svg';
import { Festivals } from '../constants/enums';
import { InAppModalRifflandia } from './Rifflandia/InAppModalRifflandia';
import { UseQueryOptions, useQuery } from 'react-query';
import { GetTickets } from '../apiManager/RecordShop';
import { LoadingRifflandia } from './Rifflandia/LoadingRifflandia';
import { StickyButton } from './StickyButton';
import { Options } from './Rifflandia/Options';
import { Login } from './Rifflandia/Login';

export const Rifflandia = () => {
  const { token, spotifyInfo } = useSpotifyAuth();
  const redirectUri = BASE_REDIRECT_URI + 'rifflandia';

  enum Weekend {
    ALL = 'All',
    PARK = 'Park',
    ELECTRIC = 'Electric',
  }

  const origin = Festivals.Rifflandia;

  const queryOptions: UseQueryOptions = {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    cacheTime: Infinity,
    keepPreviousData: true,
  };

  const query = useQuery({
    queryKey: [Festivals.Rifflandia, { origin }],
    queryFn: GetTickets,
    ...queryOptions,
  });

  const loadInterval = 15;

  const [loadMore, setLoadMore] = useState(loadInterval);
  const [showLoadMoreBtn, setShowLoadMoreBtn] = useState(false);
  const [totalTickets, setTotalTickets] = useState<any>([]);
  const [tickets, setTickets] = useState<any>([]);

  const [filteredDates, setFilteredDates] = useState<any>([]);
  const [selectedWeekend, setSelectedWeekend] = useState<string>(Weekend.ALL);
  const [numTopTracks, setNumTopTracks] = useState(1);

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
    if (filteredDates === undefined || filteredDates.length === 0 || filteredDates.length === totalTickets.length) {
      setLoadMore(loadInterval);
      setTickets(totalTickets.slice(0, loadMore));
      return;
    }
    setTickets(filteredDates);
  }, [filteredDates]);

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
    setFilteredDates((value: any) => value?.filter((v: any) => v !== genre));
  };

  const handleClearGenres = () => {
    setFilteredDates([]);
  };

  const handleFilteredGenres = (event: any) => {
    const genres = event.target.value;
    setFilteredDates(genres);
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
        city: Festivals.Rifflandia,
        token: token,
        user_id: spotifyInfo.user_id,
        numTopTracks: numTopTracks,
        // TODO: fix too large of request
        //tickets: filteredDates.length > 0 ? tickets : null,
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
    setSelectedWeekend(Weekend.ALL);
    setFilteredDates([]);
    setLoadMore(loadInterval);
    setTickets(totalTickets.slice(0, loadMore));
  };

  const handleFilterThePark = () => {
    const parkTickets = totalTickets.filter((ticket: any) => {
      if (ticket.ticket_date.includes('Sept 15-17')) return ticket;
    });
    setFilteredDates(parkTickets);
    setSelectedWeekend(Weekend.PARK);
  };

  const handleFilterElectricAve = () => {
    const electricTickets = totalTickets.filter((ticket: any) => {
      if (ticket.ticket_date.includes('Sept 7-9')) return ticket;
    });
    setFilteredDates(electricTickets);
    setSelectedWeekend(Weekend.ELECTRIC);
  };

  useEffect(() => {
    if (filteredDates.length === 0 && loadMore < totalTickets.length) {
      setShowLoadMoreBtn(true);
    } else {
      setShowLoadMoreBtn(false);
    }
  }, [filteredDates, totalTickets, loadMore]);

  if (isLoadingTickets || query.isLoading || query.isFetching || query.isRefetching) {
    return <LoadingRifflandia />;
  }

  if (!token || !spotifyInfo) {
    return <Login />;
  }

  return (
    <>
      <div className="sidebar sidebar-svg-park"></div>
      <div className="sidebar sidebar-svg-electric"></div>

      <Box
        className="riff-background"
        sx={{ textAlign: 'center', paddingBottom: '24px', backgroundColor: RIFFLANDIA_COLOURS.background }}
      >
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
            paddingBottom: !showLoadMoreBtn ? '70px' : '',
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

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                sx={{
                  fontSize: '0.75rem',
                  marginTop: '12px',
                  backgroundColor: selectedWeekend === Weekend.ALL ? RIFFLANDIA_COLOURS.fill_light_orange : '',
                  '&:active': {
                    background: RIFFLANDIA_COLOURS.fill_light_orange,
                  },
                  '&:focus': {
                    background: RIFFLANDIA_COLOURS.fill_light_orange,
                  },
                  '&:hover': {
                    background: RIFFLANDIA_COLOURS.fill_light_orange,
                  },
                }}
                onClick={() => {
                  handleClearAllFilters();
                }}
              >
                All
              </Button>
              <Button
                variant="outlined"
                sx={{
                  fontSize: '0.75rem',
                  marginTop: '12px',
                  backgroundColor: selectedWeekend === Weekend.ELECTRIC ? RIFFLANDIA_COLOURS.fill_light_orange : '',
                  '&:active': {
                    background: RIFFLANDIA_COLOURS.fill_light_orange,
                  },
                  '&:focus': {
                    background: RIFFLANDIA_COLOURS.fill_light_orange,
                  },
                  '&:hover': {
                    background: RIFFLANDIA_COLOURS.fill_light_orange,
                  },
                }}
                onClick={() => {
                  //add to filter for tickets with dates from sept 7-9
                  handleFilterElectricAve();
                }}
              >
                Electric Ave
              </Button>
              <Button
                variant="outlined"
                sx={{
                  fontSize: '0.75rem',
                  marginTop: '12px',
                  backgroundColor: selectedWeekend === Weekend.PARK ? RIFFLANDIA_COLOURS.fill_light_orange : '',
                  '&:active': {
                    background: RIFFLANDIA_COLOURS.fill_light_orange,
                  },
                  '&:focus': {
                    background: RIFFLANDIA_COLOURS.fill_light_orange,
                  },
                  '&:hover': {
                    background: RIFFLANDIA_COLOURS.fill_light_orange,
                  },
                }}
                onClick={() => {
                  //add to filter for tickets with dates from sept 15-17
                  handleFilterThePark();
                }}
              >
                The Park
              </Button>
            </Box>

            <Button
              variant="outlined"
              sx={{ marginTop: '12px', marginBottom: '24px', width: '300px' }}
              onClick={() => {
                setShowSettings(!showSettings);
              }}
            >
              Options
            </Button>

            <Button
              onClick={handleCreatePlaylist}
              variant="contained"
              className="create-playlist"
              sx={{
                backgroundColor: RIFFLANDIA_COLOURS.light_blue,
                ':hover': {
                  backgroundColor: RIFFLANDIA_COLOURS.dark_blue,
                },
                color: 'black',
                width: '300px',
                marginBottom: '24px',
                justifyContent: 'center',
              }}
            >
              <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} />
              <Typography sx={{ paddingBottom: 0 }}>Generate playlist</Typography>
            </Button>

            <Button
              variant="outlined"
              sx={{ marginBottom: '12px', marginRight: '18px', width: '300px' }}
              href={WEBSITE_RIFFLANDIA}
              target="_blank"
            >
              <Box sx={{ marginRight: '12px', height: '20px', width: '20px' }}>
                <CHERRIES />
              </Box>
              Tickets
            </Button>
          </Box>

          {showSettings && (
            <div>
              <Options
                totalTickets={totalTickets}
                filteredDates={filteredDates}
                numTopTracks={numTopTracks}
                handleFilteredGenres={handleFilteredGenres}
                handleNumTopTracks={handleNumTopTracks}
                handleDeleteGenre={handleDeleteGenre}
                handleCloseSettings={handleCloseSettings}
                handleClearGenres={handleClearGenres}
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

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {showLoadMoreBtn && (
            <Button
              variant="outlined"
              sx={{ marginTop: '24px', marginBottom: '85px' }}
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
