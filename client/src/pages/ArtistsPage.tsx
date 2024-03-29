import { Box, Collapse, Container, Fade, IconButton, Tooltip } from "@mui/material";
import Button from "@mui/material/Button/Button";
import Typography from "@mui/material/Typography";
import { COLOURS } from "../theme/AppStyles";
import { useContext, useEffect, useState } from "react";
import { SnackBarContext } from "../App";
import useSpotifyAuth from "../hooks/useSpotifyAuth";
import { LOCATIONS } from "../constants/locations";
import { Origin } from "../components/Origin";
import { Settings } from "../components/Settings";
import { TicketContainer } from "../components/TicketContainer";
import { InAppModal } from "../components/InAppModal";
import { UseQueryOptions, useQuery } from "react-query";
import { CreateNewPlaylist, GetTickets } from "../apiManager/RecordShop";
import { Loading } from "./Loading";
import { Spinner } from "../Rifflandia/Spinner";
import { sortByOrderNum } from "../utils/sorter";
import { StickyButton } from "../components/StickyButton";
import { redirectToAuth, isLoggedIntoSpotify } from "../utils/spotifyAuthUtils";
import { primaryButtonColours } from "../theme/AppStyles";
import { goToNewTabOnDesktop, isInAppBrowser, scrollToTop } from "../utils/browserUtils";
import { SpotifyIcon } from "../components/Icons";
import { isMobile } from "../utils/responsiveUtils";
import SettingsIcon from "@mui/icons-material/Settings";

export const ArtistsPage = () => {
  const queryOptions: UseQueryOptions = {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    cacheTime: Infinity,
    keepPreviousData: true,
  };

  const { token, spotifyInfo } = useSpotifyAuth();

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

  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);

  const [isShaking, setIsShaking] = useState(false);

  const [isError, setIsError] = useState(false);
  const snackBar = useContext(SnackBarContext);

  const [isInAppModalOpen, setIsInAppModalOpen] = useState(false);
  const openInAppModal = () => setIsInAppModalOpen(true);
  const closeInAppModal = () => setIsInAppModalOpen(false);

  useEffect(() => {
    document.title = "Record Shop | Artists";
    scrollToTop();
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
      setTotalTickets(sortByOrderNum(query.data));
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
        message: "Error creating playlist. Please try again.",
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

  const handleCreatePlaylist = async () => {
    setIsCreatingPlaylist(true);
    await CreateNewPlaylist({
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
            message: "Successfully created a playlist!",
            isError: false,
          });
          goToNewTabOnDesktop(res.data);
        } else {
          setIsError(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsError(true);
      });
    setIsCreatingPlaylist(false);
  };

  const handleSignIn = () => (isInAppBrowser() ? openInAppModal() : redirectToAuth());

  if (isLoadingTickets) {
    return <Loading />;
  }

  const PlaylistCreation = (
    <>
      <Box
        sx={{
          borderRadius: "10px",
          width: "300px",
          margin: "8px",
        }}
      >
        {isLoggedIntoSpotify() ? (
          <Box sx={{ display: "flex" }}>
            <Button
              onClick={handleCreatePlaylist}
              variant="contained"
              className={`${isShaking ? "shaking" : ""}`}
              sx={{
                ...primaryButtonColours,
                color: "black",
                width: "100%",
                justifyContent: "center",
                height: "48px",
              }}
            >
              {SpotifyIcon}
              <Typography sx={{ paddingBottom: 0 }}>Create playlist</Typography>
            </Button>

            <IconButton
              sx={{ marginLeft: "8px" }}
              onClick={() => {
                setShowSettings(!showSettings);
              }}
              disableRipple={true}
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        ) : isMobile() ? (
          <Button
            onClick={handleSignIn}
            variant="contained"
            className={`${isShaking ? "shaking" : ""}`}
            sx={{
              ...primaryButtonColours,
              color: "black",
              width: "300px",
              marginBottom: "16px",
              justifyContent: "center",
              height: "48px",
            }}
          >
            {SpotifyIcon}
            <Typography sx={{ paddingBottom: 0 }}>Sign in</Typography>
          </Button>
        ) : (
          <Tooltip title="Sign in to unlock this feature!">
            <span>
              <Button
                variant="contained"
                sx={{
                  width: "300px",
                  marginBottom: "16px",
                  justifyContent: "center",
                  height: "48px",
                }}
                disabled
              >
                {SpotifyIcon}
                <Typography sx={{ paddingBottom: 0, color: "grey" }}>Create playlist</Typography>
              </Button>
            </span>
          </Tooltip>
        )}
      </Box>

      <Collapse in={showSettings} collapsedSize={0}>
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
      </Collapse>
    </>
  );

  return (
    <>
      {isCreatingPlaylist && <Spinner />}
      <Box sx={{ marginTop: "-24px", textAlign: "center", paddingBottom: "125px" }}>
        <Typography
          sx={{
            fontSize: "4rem",
            fontFamily: "Lobster, Arial, sans-serif",
            letterSpacing: "2px",
            marginBottom: "12px",
          }}
        >
          Record Shop
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box sx={{ maxWidth: "900px" }}>
            <Container
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
              }}
            >
              <Box
                sx={{
                  borderRadius: "10px",
                  width: "300px",
                  margin: "8px",
                }}
              >
                <Origin origin={origin} handleChangeOrigin={handleChangeOrigin} />
              </Box>

              {PlaylistCreation}
            </Container>

            <Container
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                paddingTop: "24px",
              }}
            >
              <TicketContainer
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
            sx={{ marginTop: "24px", marginBottom: "32px" }}
            onClick={() => {
              setLoadMore(loadMore + loadInterval);
            }}
          >
            Load more
          </Button>
        )}
      </Box>

      {isLoggedIntoSpotify() && (
        <StickyButton
          handleCreatePlaylist={handleCreatePlaylist}
          backgroundColor={COLOURS.blue}
          hoverColor={COLOURS.card_colours[1]}
          barColor={COLOURS.card_colours[2]}
        />
      )}

      <InAppModal open={isInAppModalOpen} handleClose={closeInAppModal} handleRedirectToAuth={redirectToAuth} />
    </>
  );
};
