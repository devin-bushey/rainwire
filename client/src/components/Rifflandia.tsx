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
import { Settings } from './Settings';
import { TicketContainer } from './TicketContainer';
import './styles/ClickMe.css';
import { InAppModal } from './InAppModal';
import { RIFFLANDIA_COLOURS } from './Rifflandia/colours';
import './Rifflandia/styles.css';
import TITLE from './Rifflandia/title.svg';
import { Festivals } from '../constants/enums';

export const Rifflandia = (data: any) => {
  const { token, spotifyInfo } = useSpotifyAuth();
  const redirectUri = BASE_REDIRECT_URI + 'rifflandia/';

  const loadInterval = 15;

  const [loadMore, setLoadMore] = useState(loadInterval);
  const [totalTickets, setTotalTickets] = useState<any>(data.tickets);
  const [tickets, setTickets] = useState<any>(totalTickets.slice(0, loadMore));

  const [filteredGenres, setFilteredGenres] = useState<any>([]);
  const [numTopTracks, setNumTopTracks] = useState(1);

  const [showSettings, setShowSettings] = useState(false);
  const [showGenres, setShowGenres] = useState(false);

  const [isError, setIsError] = useState(false);
  const snackBar = useContext(SnackBarContext);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    setTotalTickets(data.tickets);
  }, [data.tickets]);

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

  return (
    <>
      <div className="sidebar sidebar-svg-park"></div>
      <div className="sidebar sidebar-svg-electric"></div>
      <Box
        sx={{
          backgroundColor: RIFFLANDIA_COLOURS.background,
          paddingTop: '75px',
          paddingLeft: '100px',
          paddingRight: '100px',
          paddingBottom: '75px',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={{
              borderRadius: '10px',
              width: '300px',
            }}
          >
            <img src={TITLE} alt="Rifflandia Title" />

            <Button
              onClick={handleCreatePlaylist}
              variant="contained"
              color="secondary"
              className="btn--click-me"
              sx={{ width: '300px', marginTop: '12px', justifyContent: 'center' }}
            >
              <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} />
              <Typography sx={{ paddingBottom: 0 }}>Create playlist</Typography>
            </Button>

            <Box display={'flex'} justifyContent={'center'}>
              <Button
                variant="outlined"
                sx={{ marginTop: '12px', marginBottom: '12px', marginRight: '18px', width: '145px' }}
                href={WEBSITE_RIFFLANDIA}
                target="_blank"
              >
                Get Tickets
              </Button>

              <Button
                variant="outlined"
                sx={{ marginTop: '12px', marginBottom: '12px', width: '145px' }}
                onClick={() => {
                  setShowSettings(!showSettings);
                }}
              >
                Settings
              </Button>
            </Box>
          </Box>
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

        <Box sx={{ textAlign: 'center', paddingBottom: '24px' }}>
          <Container sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
            <TicketContainer
              tickets={tickets}
              showGenres={showGenres}
              isLoadingTickets={false}
              isErrorTickets={false}
            />
          </Container>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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

        <InAppModal open={open} handleClose={handleClose} handleRedirectToAuth={handleRedirectToAuth} />
      </Box>
    </>
  );
};
