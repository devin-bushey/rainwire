import {
  Autocomplete,
  Box,
  Card,
  CardMedia,
  Chip,
  Container,
  MenuItem,
  TextField,
  Select,
  Slider,
} from '@mui/material';
import Button from '@mui/material/Button/Button';
import Typography from '@mui/material/Typography';
import { COLOURS } from '../theme/AppStyles';
import { useContext, useEffect, useState } from 'react';
import spotifyLogoBlack from '../spotifyLogos/Spotify_Logo_RGB_Black.png';
import spotifyIcon from '../spotifyLogos/Spotify_Icon_RGB_Black.png';
import { LOCATIONS } from '../constants/constants';
import { CreateNewPlaylist, GetSpotifyUserInfo } from '../apiManager/Spotify';
import { encrypt, getSpotifyTokenLocalStorage } from '../utils/tokenHandling';
import { Cities, Festivals } from '../constants/enums';
import hash from '../utils/hash';
import { SpotifyUserDataType } from '../types/SpotifyTypes';
import { SnackBarContext } from '../App';
import { LocationType } from '../types/RecordShopTypes';
import { Loading } from './Loading';
import { UseQueryOptions, useQuery } from 'react-query';
import { GetTickets } from '../apiManager/RecordShop';
import { Error } from './Error';

export const authEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = import.meta.env.VITE_SP_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SITE_URL + 'tickets';
const scopes = ['playlist-modify-public'];

export const DisplayTickets = (data: any) => {
  if (!data.tickets) {
    return <Loading />;
  }

  const WEBSITE_PHILIPS = 'https://www.phillipsbackyard.com/';
  const WEBSITE_WHISTLE = 'https://www.eventbrite.ca/e/whistlemania-2023-tickets-623971705167/';
  const WEBSITE_VICTORIA = 'https://victoriamusicscene.com/concerts/';
  const WEBSITE_VANCOUVER = 'https://www.ticketmaster.ca/discover/concerts/vancouver';

  const queryOptions: UseQueryOptions = {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    cacheTime: Infinity,
    enabled: false,
  };

  const victoriaQuery = useQuery({
    queryKey: [Cities.Victoria],
    queryFn: () => GetTickets(Cities.Victoria),
    ...queryOptions,
  });

  const vancouverQuery = useQuery({
    queryKey: [Cities.Vancouver],
    queryFn: () => GetTickets(Cities.Vancouver),
    ...queryOptions,
  });

  const philipsQuery = useQuery({
    queryKey: [Festivals.PhilipsBackyard],
    queryFn: () => GetTickets(Festivals.PhilipsBackyard),
    ...queryOptions,
  });

  const whistleQuery = useQuery({
    queryKey: [Festivals.Whistlemania],
    queryFn: () => GetTickets(Festivals.Whistlemania),
    ...queryOptions,
  });

  const loadInterval = 15;
  const [loadMore, setLoadMore] = useState(loadInterval);

  const [first20Tickets, setFirst20Tickets] = useState<any>(data.tickets.slice(0, loadMore));
  const [totalTickets, setTotalTickets] = useState<any>(data.tickets);
  const [tickets, setTickets] = useState(first20Tickets);

  const [numTopTracks, setNumTopTracks] = useState(1);

  const [showSettings, setShowSettings] = useState(false);
  const [showGenres, setShowGenres] = useState(false);

  const [origin, setOrigin] = useState(LOCATIONS[0].value);
  const [query, setQuery] = useState(philipsQuery);
  const [website, setWebsite] = useState(WEBSITE_PHILIPS);

  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [isErrorTickets, setIsErrorTickets] = useState(false);

  useEffect(() => {
    setFirst20Tickets(totalTickets.slice(0, loadMore));
  }, [totalTickets]);

  useEffect(() => {
    setFilteredGenres(undefined);
    if (origin === Cities.Victoria) {
      victoriaQuery.refetch();
      setQuery(victoriaQuery);
      setWebsite(WEBSITE_VICTORIA);
      return;
    }
    if (origin === Cities.Vancouver) {
      vancouverQuery.refetch();
      setQuery(vancouverQuery);
      setWebsite(WEBSITE_VANCOUVER);
      return;
    }
    if (origin === Festivals.PhilipsBackyard) {
      philipsQuery.refetch();
      setQuery(philipsQuery);
      setWebsite(WEBSITE_PHILIPS);
      return;
    }
    if (origin === Festivals.Whistlemania) {
      whistleQuery.refetch();
      setQuery(whistleQuery);
      setWebsite(WEBSITE_WHISTLE);
      return;
    }
    if (origin === Festivals.Rifflandia) {
      //TODO
      return;
    }
  }, [origin]);

  useEffect(() => {
    if (query.data) {
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

  const [filteredGenres, setFilteredGenres] = useState<any[]>();
  const genres: any = [];
  totalTickets.forEach((ticket: any) => {
    if (ticket?.genres === undefined) return;
    ticket.genres.forEach((genre: any) => {
      if (!genres.includes(genre)) {
        genres.push(genre);
      }
    });
  });

  useEffect(() => {
    if (filteredGenres === undefined || filteredGenres.length === 0) {
      setShowGenres(false);
      setTickets(first20Tickets);
      return;
    }

    const filteredTickets = totalTickets.filter((ticket: any) => {
      let isFound = false;
      //console.log(ticket);
      if (ticket?.genres === undefined) return false;
      ticket.genres.forEach((genre: any) => {
        if (filteredGenres.includes(genre)) {
          isFound = true;
        }
      });
      return isFound;
    });

    if (filteredTickets.length > 0) {
      setShowGenres(true);
    }

    setTickets(filteredTickets);
  }, [filteredGenres]);

  // get token
  const [token, setToken] = useState('');
  const [spotifyInfo, setSpotifyInfo] = useState<SpotifyUserDataType>({
    firstName: '',
    user_name: '',
    user_id: '',
    new_playlist_id: '',
    access: false,
  });
  const [isError, setIsError] = useState(false);
  const snackBar = useContext(SnackBarContext);
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
    const localToken = getSpotifyTokenLocalStorage();
    let _token;

    // first, check for token in local storage
    // if not there, check for token in url, and if there, set it in local storage
    if (localToken) {
      _token = localToken;
      setToken(localToken);
    } else {
      _token = hash.access_token;
      if (_token) {
        encrypt(_token);
        setToken(_token);
      }
    }

    // if there is a token, get the user's info
    GetSpotifyUserInfo(_token).then((response) => {
      if (response.error) {
        localStorage.clear();
      }

      setSpotifyInfo((prevState) => ({
        ...prevState,
        firstName: response.firstName,
        user_name: response.user_name,
        user_id: response.user_id,
        access: response.access,
      }));
    });
  }, []);

  useEffect(() => {
    //console.log(totalTickets);
    setTickets(totalTickets.slice(0, loadInterval));
    setLoadMore(loadInterval);
  }, [totalTickets]);

  useEffect(() => {
    setTickets(totalTickets.slice(0, loadMore));
  }, [loadMore]);

  const onDelete = (genre: string) => () => {
    setFilteredGenres((value) => value?.filter((v) => v !== genre));
  };

  const handleChange = (event: any) => {
    setOrigin(event.target.value);
  };

  const Location = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ minWidth: '310px' }}>
          <Select
            value={origin}
            onChange={handleChange}
            fullWidth
            sx={{
              height: '40px',
            }}
          >
            {LOCATIONS.map((location: LocationType) => (
              <MenuItem key={location.name} value={location.value}>
                {location.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    );
  };

  const Settings = () => {
    const marks = [
      {
        value: 1,
        label: '1',
      },
      {
        value: 2,
        label: '2',
      },
      {
        value: 3,
        label: '3',
      },
      {
        value: 4,
        label: '4',
      },
      {
        value: 5,
        label: '5',
      },
    ];

    return (
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginBottom: '24px',
        }}
      >
        <Card
          sx={{
            backgroundColor: 'hsl(141, 12%, 80%)',
            minHeight: '290px',
            width: '310px',
            margin: '8px',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
            <Typography variant="h5" sx={{ color: COLOURS.black }}>
              <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} />
              Settings
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <Typography variant="h6" sx={{ color: COLOURS.black }}>
              tracks per artist:
            </Typography>
            <Box sx={{ width: '90%' }}>
              <Slider
                aria-label="Number of tracks per artist"
                valueLabelDisplay="auto"
                step={1}
                marks={marks}
                min={1}
                max={5}
                value={numTopTracks}
                onChange={(e: any) => {
                  setNumTopTracks(e.target.value);
                }}
              />
            </Box>
            {/* <TextField
              id="outlined-basic"
              variant="outlined"
              //placeholder="1"
              value={numTopTracks}
              onChange={(e: any) => {
                setNumTopTracks(e.target.value);
              }}
              type="number"
              InputProps={{ inputProps: { min: 0, max: 5 } }}
              sx={{ width: '75px', marginLeft: '12px' }}
            /> */}
          </Box>

          <Filter />

          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button
              variant="outlined"
              sx={{ color: COLOURS.black }}
              onClick={() => {
                setShowSettings(false);
              }}
            >
              Close
            </Button>
          </Box>
        </Card>
      </Container>
    );
  };

  const Filter = () => {
    return (
      <Box sx={{ marginBottom: '24px' }}>
        {/* <Select
            value={origin}
            onChange={handleChange}
            fullWidth
            sx={{
              height: '40px',
            }}
          >
            {LOCATIONS.map((location: LocationType) => (
              <MenuItem key={location.name} value={location.value}>
                {location.name}
              </MenuItem>
            ))}
          </Select> */}

        <Autocomplete
          value={filteredGenres}
          onChange={(event, newValue, reason) => {
            if (reason === 'clear') {
              setFilteredGenres([]);
            } else {
              setFilteredGenres(newValue);
            }
          }}
          multiple
          id="tags-standard"
          fullWidth={true}
          options={genres}
          getOptionLabel={(option: string) => option}
          renderTags={() => null}
          style={{
            maxWidth: 340,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '24px',
          }}
          //placeholder="Genres"
          //inputValue=""
          renderInput={(params) => (
            <div ref={params.InputProps.ref}>
              <TextField
                sx={{ caretColor: 'transparent' }}
                {...params}
                // inputProps={{
                //   onKeyPress: (e) => {
                //     e.preventDefault();
                //   },
                // }}
                //inputProps={{ style: { caretColor: 'transparent' } }}
                variant="standard"
                placeholder="Genres"
                disabled={true}
              />
            </div>
          )}
        />
        <Box
          mt={3}
          sx={{
            '& > :not(:last-child)': { mr: 1 },
            '& > *': { mr: 1 },
          }}
        >
          {filteredGenres?.map((genre) => (
            <Chip key={genre} label={genre} onDelete={onDelete(genre)} />
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ textAlign: 'center', paddingBottom: '24px' }}>
      <Typography variant="h5" sx={{ color: COLOURS.black, textAlign: 'center', marginBottom: '8px' }}>
        Preview artists playing in
      </Typography>

      <Location />

      <Button
        onClick={() => {
          token && spotifyInfo.access
            ? CreateNewPlaylist({
                city: origin,
                token: token,
                user_id: spotifyInfo.user_id,
                setIsError: setIsError,
                numTopTracks: numTopTracks,
                tickets: filteredGenres ? tickets : null,
              })
            : (location.href = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                '%20',
              )}&response_type=token&show_dialog=true`);
        }}
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
          {/* <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} /> */}
          Settings
        </Button>
      </Box>

      {showSettings && <Settings />}

      <Container sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
        {ticketContainer({ tickets, showGenres, isLoadingTickets, isErrorTickets })}
      </Container>
      {!filteredGenres && loadMore < totalTickets.length && (
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

const ticketContainer = ({
  tickets,
  showGenres,
  isLoadingTickets,
  isErrorTickets,
}: {
  tickets: any;
  showGenres: boolean;
  isLoadingTickets: boolean;
  isErrorTickets: boolean;
}) => {
  const colors = COLOURS.card_colours;

  if (isLoadingTickets) {
    return <Loading />;
  }

  if (isErrorTickets || tickets.length === 0) {
    return <Error />;
  }

  return tickets.map((currentTicket: any, index: any) => {
    let imageURL;
    try {
      imageURL = currentTicket.top_tracks[0].album.images[1].url;
    } catch {
      //TODO: find generic image
      imageURL = ' ';
    }

    return (
      <Ticket
        ticket={currentTicket}
        showGenres={showGenres}
        image={imageURL}
        bgcolor={colors[index % colors.length]}
        key={currentTicket._id}
      />
    );
  });
};

const Ticket = (props: any) => (
  <Card
    sx={{
      backgroundColor: props.bgcolor,
      height: props.showGenres ? '330px' : '300px',
      width: '300px',
      margin: '8px',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'left' }}>
      <img src={spotifyLogoBlack} alt="spotify_logo" width="75px" height="auto" style={{ marginBottom: '14px' }} />
    </Box>

    <Box sx={{ height: '60px', display: 'flex', alignItems: 'center', textAlign: 'left' }}>
      <Typography
        sx={{
          fontWeight: '700',
          fontSize: '1.25rem',
        }}
      >
        {props.ticket.sp_band_name}
      </Typography>
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CardMedia component="img" sx={{ width: 120, height: 120 }} image={props.image} alt="Album" />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '8px',
          textAlign: 'center',
          alignContent: 'space-between',
        }}
      >
        <Typography
          sx={{
            fontWeight: '700',
            fontSize: '0.77rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '4',
            WebkitBoxOrient: 'vertical',
            paddingBottom: '0px',
            marginBottom: '8px',
          }}
        >
          {props.ticket.ticket_date}
        </Typography>
        {/* <Typography sx={{ fontSize: '0.9rem' }}>{props.ticket.ticket_price}</Typography> */}
        <Button href={props.ticket.link} target="_blank" variant="outlined">
          {/* <img src={spotifyIconBlack} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: '8px' }} /> */}
          artist
        </Button>
      </Box>
    </Box>

    {props.showGenres && (
      <Box sx={{ height: '60px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography
          sx={{
            //fontWeight: '700',
            fontSize: '0.75rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
            paddingBottom: '0px',
            marginBottom: '8px',
          }}
        >
          {props.ticket.genres}
        </Typography>
      </Box>
    )}
  </Card>
);
