import { Box, Container, TextField } from "@mui/material";
import Button from "@mui/material/Button/Button";
import Typography from "@mui/material/Typography";
import { COLOURS } from "../theme/AppStyles";
import { useContext, useEffect, useState } from "react";
import spotifyIcon from "../spotifyLogos/Spotify_Icon_RGB_Black.png";
import { SnackBarContext } from "../App";
import useSpotifyAuth from "../hooks/useSpotifyAuth";
import { AUTH_ENDPOINT, BASE_REDIRECT_URI, CLIENT_ID, SCOPES } from "../constants/auth";
import { InAppModal } from "../components/InAppModal";
import { UseQueryOptions, useQuery } from "react-query";
import { CreateNewPlaylistJamBase, GetJamBase } from "../apiManager/RecordShop";
import { Loading } from "./Loading";
import { Spinner } from "../Rifflandia/Spinner";
import { StickyButton } from "../components/StickyButton";
import { JamBaseTicketContainer } from "../components/JamBaseTicketContainer";
import { ErrorJamBase } from "../components/ErrorJamBase";
import { JamBaseEmpty } from "../components/JamBaseEmpty";
import "../styles/ClickMe.css";
import { goToNewTab, scrollToTop } from "../utils/browserUtils";

export const JamBase = () => {
  const queryOptions: UseQueryOptions = {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    cacheTime: 50000,
    staleTime: 100,
  };

  // Spotify Authentication / Authorization
  const { token, spotifyInfo } = useSpotifyAuth();
  const redirectUri = BASE_REDIRECT_URI + "explore";

  // City of choice
  const [city, setCity] = useState("");

  // React Query to fetch the data (concerts)
  const { isLoading, isError, data } = useQuery({
    queryKey: [`${city}_jb`, { origin: city }],
    queryFn: GetJamBase,
    ...queryOptions,
  });

  const [jamLocation, setJamLocation] = useState("");
  const [cantFindSongs, setCantFindSongs] = useState(false);

  useEffect(() => {
    if (data) {
      const x = data as any;
      if (x && x.length > 0) {
        setJamLocation(x[0].location);
        setCantFindSongs(false);
      } else {
        setCantFindSongs(true);
      }
    }
  }, [data]);

  // State variable to shake the blue Create Playlist / Sign In button
  const [isShaking, setIsShaking] = useState(false);

  // State variables for creating a Spotify playlist
  const [isCreatePlaylistError, setIsError] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);

  // Snackbar / Toast message to show status of creating a Spotify playlist
  const snackBar = useContext(SnackBarContext);

  // State variables to show modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    document.title = "Record Shop | Explore";
    scrollToTop();
    setCity("");
  }, []);

  useEffect(() => {
    setIsShaking(true);
    // Reset the shaking animation after a delay
    setTimeout(() => {
      setIsShaking(false);
    }, 2000);
  }, []);

  useEffect(() => {
    if (isCreatePlaylistError) {
      snackBar.setSnackBar({
        showSnackbar: true,
        setShowSnackbar: () => true,
        message: "Error creating playlist. Please try again.",
        isError: true,
      });
      setIsError(false);
    }
  }, [isCreatePlaylistError]);

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
      "%20",
    )}&response_type=token&show_dialog=true`;
  };

  const handleCreatePlaylist = async () => {
    if (token && spotifyInfo.access) {
      setIsCreatingPlaylist(true);
      await CreateNewPlaylistJamBase({
        city: city,
        token: token,
        user_id: spotifyInfo.user_id,
      })
        .then((res) => {
          if (res.status === 201) {
            snackBar.setSnackBar({
              showSnackbar: true,
              setShowSnackbar: () => true,
              message: "Successfully created a playlist!",
              isError: false,
            });
            goToNewTab(res.data);
          } else {
            setIsError(true);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsError(true);
        });
      setIsCreatingPlaylist(false);
    } else {
      isInAppBrowser();
    }
  };

  const [textFieldValue, setTextFieldValue] = useState("");

  const onKeyPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    console.log("Submitted value:", textFieldValue);
    setCantFindSongs(false);
    setCity(textFieldValue);
  };

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

        <Box
          sx={{
            borderRadius: "10px",
            minWidth: "300px",
            margin: "8px",
            marginBottom: "24px",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <form onSubmit={handleSubmit}>
              {" "}
              {/* Use a form element */}
              <Box className="btn--click-me" sx={{ minWidth: "300px", display: "flex" }}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label={city}
                  variant="outlined"
                  value={textFieldValue}
                  onChange={(e) => setTextFieldValue(e.target.value)}
                  onKeyDown={onKeyPress}
                />
                <Button onClick={handleSubmit} variant="outlined" color="primary" sx={{ marginLeft: "6px" }}>
                  GO
                </Button>{" "}
                {/* Submit button */}
              </Box>
            </form>
          </Box>

          <Button
            onClick={handleCreatePlaylist}
            variant="contained"
            className={`${isShaking ? "shaking" : ""}`}
            sx={{
              backgroundColor: COLOURS.blue,
              ":hover": {
                backgroundColor: COLOURS.card_colours[1],
              },
              color: "black",
              width: "300px",
              marginTop: "24px",
              marginBottom: "16px",
              justifyContent: "center",
              height: "48px",
            }}
          >
            <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "8px" }} />
            <Typography sx={{ paddingBottom: 0 }}>
              {token && spotifyInfo.access ? "Create playlist" : "Sign in"}
            </Typography>
          </Button>

          {!cantFindSongs &&
            !isLoading &&
            !isError &&
            city != null &&
            city != "" &&
            jamLocation != null &&
            jamLocation != "" && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{ minWidth: "300px" }}>
                  <Typography>{`Showing artists in ${jamLocation}`}</Typography>
                </Box>
              </Box>
            )}
        </Box>
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
              {(city === "" || !city) && <JamBaseEmpty />}
              {(city != "" || city) && isLoading && !isError && <Loading />}
              {(((city != "" || city) && !isLoading && isError) || cantFindSongs) && <ErrorJamBase />}
              {(city != "" || city) && !isLoading && !isError && <JamBaseTicketContainer tickets={data} />}
            </Container>
          </Box>
        </Box>
      </Box>

      <StickyButton
        handleCreatePlaylist={handleCreatePlaylist}
        backgroundColor={COLOURS.blue}
        hoverColor={COLOURS.card_colours[1]}
        barColor={COLOURS.card_colours[2]}
      />

      <InAppModal open={open} handleClose={handleClose} handleRedirectToAuth={handleRedirectToAuth} />
    </>
  );
};
