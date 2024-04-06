import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";

import { Box, Card, Container } from "@mui/material";
import Button from "@mui/material/Button/Button";
import Typography from "@mui/material/Typography";

import { RIFFLANDIA_COLOURS, RIFF_CARD_COLOURS } from "../constants/colours";
import { WEBSITE_RIFFLANDIA } from "../../constants/locations";

import { TicketContainer } from "../TicketContainer";
import { ContactUsModal } from "../../components/ContactUsModal";
import { SignInModalRifflandia } from "../SignInModalRifflandia";
import { InAppModalRifflandia } from "../InAppModalRifflandia";
import { LoadingRifflandia } from "../LoadingRifflandia";
import { StickyButton } from "../../components/StickyButton";

import { CreateNewPlaylistRifflandia, GetTicketsRifflandia } from "../apiManager/API_Rifflandia";
import { Options } from "../Options";
import { SelectDays } from "../SelectDays";
import { Spinner } from "../../components/Spinner";

import { SnackBarContext } from "../../App";
import { SpotifyUserDataType } from "../../types/SpotifyTypes";
import { Festivals } from "../../constants/enums";
import { sortByOrderNum, sortDataByDateAndOrder } from "../../utils/sorter";

import useSpotifyAuth from "../../hooks/useSpotifyAuth";
import { goToNewTab, goToNewTabOnDesktop, isInAppBrowser, scrollToTop } from "../../utils/browserUtils";
import { logOut, redirectToAuth } from "../../utils/spotifyAuthUtils";

import "../../styles/ClickMe.css";
import "../styles/styles.css";

import TITLE from "../images/title.svg";
import { ReactComponent as CHERRIES } from "../images/cherries.svg";
import spotifyIcon from "../../spotifyLogos/Spotify_Icon_RGB_Black.png";
import { SpotifyPreviewModal } from "../SpotifyPreviewModal";
import { PageClassName } from "../../theme/AppStyles";

const TICKET_LINK = WEBSITE_RIFFLANDIA;

const RIFFLANDIA_PAGE_CLASS = PageClassName.Rifflandia;

const COLOURS = Object.freeze({
  pageBackground: RIFFLANDIA_COLOURS.background,
  descriptionBackground: RIFFLANDIA_COLOURS.fill_pale_purple,
  primaryButton: {
    background: RIFFLANDIA_COLOURS.light_blue,
    backgroundHover: RIFFLANDIA_COLOURS.dark_blue,
    text: "black",
  },
  secondaryButton: {
    background: RIFFLANDIA_COLOURS.light_blue_opaque,
    backgroundHover: RIFFLANDIA_COLOURS.dark_blue,
    text: "rgba(3, 49, 46, 0.8)",
  },
  settingsBackground: RIFFLANDIA_COLOURS.fill_pale_green,
  stickyButtonBackground: RIFFLANDIA_COLOURS.fill_light_orange,
  cardColours: RIFF_CARD_COLOURS,
});

const PRIMARY_BUTTON_SX = {
  backgroundColor: COLOURS.primaryButton.background,
  ":hover": {
    backgroundColor: COLOURS.primaryButton.backgroundHover,
  },
  color: COLOURS.primaryButton.text,
};

const SECONDARY_BUTTON_SX = {
  backgroundColor: COLOURS.secondaryButton.background,
  ":hover": {
    backgroundColor: COLOURS.secondaryButton.backgroundHover,
  },
  color: COLOURS.secondaryButton.text,
};

const LOAD_INTERVAL = 15;

export const Rifflandia = () => {
  const { token, spotifyInfo } = useSpotifyAuth();

  const [isInAppModalOpen, setIsInAppModalOpen] = useState(false);
  const openInAppModal = () => setIsInAppModalOpen(true);
  const closeInAppModal = () => setIsInAppModalOpen(false);

  useEffect(() => {
    document.title = "Record Shop | Rifflandia";
    scrollToTop();
  }, []);

  const handleRedirectToAuthForBrowser = isInAppBrowser() ? openInAppModal : redirectToAuth;

  return (
    <div className={RIFFLANDIA_PAGE_CLASS}>
      <div className="sidebar sidebar-svg-park"></div>
      <div className="sidebar sidebar-svg-electric"></div>

      <Box
        className="riff-background"
        sx={{
          textAlign: "center",
          paddingBottom: "24px",
          backgroundColor: COLOURS.pageBackground,
        }}
      >
        <Container
          sx={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              minWidth: "300px",
              maxWidth: "550px",
            }}
          >
            <RecordShopTitle />

            <Description
              token={token}
              spotifyInfo={spotifyInfo}
              handleRedirectToAuthForBrowser={handleRedirectToAuthForBrowser}
            />
          </Box>
        </Container>

        <Artists
          token={token}
          spotifyInfo={spotifyInfo}
          handleRedirectToAuthForBrowser={handleRedirectToAuthForBrowser}
        />
      </Box>

      <InAppModalRifflandia isOpen={isInAppModalOpen} closeModal={closeInAppModal} />
    </div>
  );
};

type DescriptionProps = {
  token: string;
  spotifyInfo: SpotifyUserDataType;
  handleRedirectToAuthForBrowser: () => void;
};

const Description = ({ token, spotifyInfo, handleRedirectToAuthForBrowser }: DescriptionProps) => (
  <Card
    sx={{
      backgroundColor: COLOURS.descriptionBackground,
      marginTop: "24px",
      marginBottom: "64px",
    }}
  >
    <Typography sx={{ marginTop: "12px" }}>
      Effortlessly generate a playlist within seconds featuring the top tracks from each artist performing at
      Rifflandia.
    </Typography>

    <Typography sx={{ marginTop: "24px" }}>
      The playlist can be pre-populated and created right on your account!
    </Typography>

    {(!token || !spotifyInfo || !spotifyInfo.access) && (
      <>
        <SignInButton handleRedirectToAuthForBrowser={handleRedirectToAuthForBrowser} />

        <PreviewPlaylistButton />
      </>
    )}

    <BuiltByRecordShop />
  </Card>
);

const RecordShopTitle = () => (
  <>
    <Typography
      sx={{
        fontSize: "4rem",
        fontFamily: "Lobster, cursive",
        letterSpacing: "2px",
        color: "black",
      }}
    >
      Record Shop
    </Typography>
  </>
);

const SignInButton = ({ handleRedirectToAuthForBrowser }: { handleRedirectToAuthForBrowser: () => void }) => (
  <>
    <Typography sx={{ marginTop: "24px", fontWeight: "900" }}>Start by signing into your Spotify account:</Typography>

    <Button
      onClick={handleRedirectToAuthForBrowser}
      variant="contained"
      sx={{
        ...PRIMARY_BUTTON_SX,
        width: "100%",
        marginTop: "24px",

        justifyContent: "center",
        height: "48px",
      }}
    >
      <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "16px" }} />
      <Typography sx={{ fontWeight: "700", paddingBottom: 0 }}>Sign in</Typography>
    </Button>
  </>
);

const PreviewPlaylistButton = () => (
  <>
    <div style={{ marginTop: "48px" }}>Or preview an already created playlist:</div>

    <Button
      onClick={() => goToNewTabOnDesktop("https://open.spotify.com/playlist/0v9ue8L0rG6OqxKc2hbAZh")}
      variant="outlined"
      sx={{
        ...SECONDARY_BUTTON_SX,
        width: "230px",
        marginTop: "12px",
        justifyContent: "center",
        height: "36px",
      }}
    >
      <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "16px" }} />
      <Typography
        sx={{
          fontSize: "0.8rem",
          fontWeight: "700",
          paddingBottom: 0,
        }}
      >
        Preview a Playlist
      </Typography>
    </Button>

    <div
      style={{
        fontSize: "0.7rem",
        marginBottom: "24px",
        marginTop: "4px",
      }}
    >
      (but its more fun to customize your own)
    </div>
  </>
);

const BuiltByRecordShop = () => {
  const [isContactUsModalOpen, setIsContactUsModalOpen] = useState(false);
  const openContactUsModal = () => setIsContactUsModalOpen(true);
  const closeContactUsModal = () => setIsContactUsModalOpen(false);

  return (
    <>
      <div style={{ marginTop: "32px" }}>
        <a
          href="/"
          style={{
            fontSize: "1.1rem",
            fontFamily: "Lobster, cursive",
            marginRight: "4px",
          }}
        >
          Record Shop{" "}
        </a>{" "}
        by{" "}
        <button className="email-btn" onClick={openContactUsModal}>
          Devin B
        </button>
      </div>
      <div style={{ marginTop: "8px", fontSize: "0.7rem" }}>Made in Victoria, BC</div>

      <ContactUsModal
        isOpen={isContactUsModalOpen}
        closeModal={closeContactUsModal}
        pageClassName={RIFFLANDIA_PAGE_CLASS}
      />
    </>
  );
};

type ArtistsProps = {
  token: string;
  spotifyInfo: SpotifyUserDataType;
  handleRedirectToAuthForBrowser: () => void;
};

const Artists = ({ token, spotifyInfo, handleRedirectToAuthForBrowser }: ArtistsProps) => {
  const [loadMore, setLoadMore] = useState(LOAD_INTERVAL);
  const [showLoadMoreBtn, setShowLoadMoreBtn] = useState(false);
  const [totalTickets, setTotalTickets] = useState<any>([]);
  const [tickets, setTickets] = useState<any>([]);

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [numTopTracks, setNumTopTracks] = useState(1);

  const [showSelectDays, setShowSelectDays] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [isErrorTickets, setIsErrorTickets] = useState(false);

  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);
  const [isError, setIsError] = useState(false);
  const snackBar = useContext(SnackBarContext);

  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);

  const [spotifyPreviewArtistId, setSpotifyPreviewArtistId] = useState<string | undefined>();

  const query = useQuery({
    queryKey: [Festivals.Rifflandia],
    queryFn: GetTicketsRifflandia,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    cacheTime: Infinity,
    keepPreviousData: true,
  });

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
      setLoadMore(LOAD_INTERVAL);
      setTotalTickets(sortByOrderNum(query.data));
    }
  }, [query.data]);

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
    setTickets(totalTickets.slice(0, LOAD_INTERVAL));
    setLoadMore(LOAD_INTERVAL);
  }, [totalTickets]);

  useEffect(() => {
    setTickets(totalTickets.slice(0, loadMore));
  }, [loadMore]);

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

  const handleNumTopTracks = (event: any) => {
    setNumTopTracks(event.target.value);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleCloseSelectDays = () => {
    setShowSelectDays(false);
  };

  const handleCreatePlaylist = async () => {
    if (token && spotifyInfo.access) {
      setIsLoadingPlaylist(true);
      await CreateNewPlaylistRifflandia({
        token: token,
        user_id: spotifyInfo.user_id,
        numTopTracks: numTopTracks,
        days: selectedDays,
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

      setIsLoadingPlaylist(false);
    } else {
      openSignInModal();
    }
  };

  const handleClearAllFilters = () => {
    setLoadMore(LOAD_INTERVAL);
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

  if (isLoadingTickets || query.isLoading || query.isFetching || query.isRefetching) {
    return <LoadingRifflandia />;
  } else {
    return (
      <Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {isLoadingPlaylist && <Spinner />}

          <Box sx={{ maxWidth: "900px" }}>
            <Container
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                paddingBottom: !showLoadMoreBtn ? "120px" : "",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  borderRadius: "10px",
                  width: "300px",
                  margin: "8px",
                }}
              >
                <img src={TITLE} alt="Rifflandia Title" />

                <CreatePlaylistButton handleCreatePlaylist={handleCreatePlaylist} />
              </Box>

              <Box
                sx={{
                  borderRadius: "10px",
                  width: "300px",
                  margin: "8px",
                }}
              >
                <Button
                  variant="outlined"
                  sx={{ marginBottom: "16px", width: "300px" }}
                  onClick={() => {
                    setShowSettings(!showSettings);
                  }}
                >
                  Customize
                </Button>

                <BuyTicketsButton />

                {!(!token || !spotifyInfo || !spotifyInfo.access) && <SignOutButton />}
              </Box>

              {showSelectDays && (
                <div>
                  <SelectDays
                    selectedDays={selectedDays}
                    handleDayClick={handleDayClick}
                    handleCloseSelectDays={handleCloseSelectDays}
                    colour={COLOURS.settingsBackground}
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
                    colour={COLOURS.settingsBackground}
                    token={token}
                    spotifyInfo={spotifyInfo}
                  />
                </div>
              )}

              <TicketContainer
                tickets={tickets}
                isLoadingTickets={false}
                isErrorTickets={isErrorTickets}
                cardColours={COLOURS.cardColours}
                setSpotifyPreviewArtistId={setSpotifyPreviewArtistId}
              />
            </Container>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {showLoadMoreBtn && (
            <Button
              variant="outlined"
              sx={{ marginTop: "24px", marginBottom: "120px" }}
              onClick={() => {
                setLoadMore(loadMore + LOAD_INTERVAL);
              }}
            >
              Load more
            </Button>
          )}
        </Box>

        <StickyButton handleCreatePlaylist={handleCreatePlaylist} barColor={COLOURS.stickyButtonBackground} />

        <SignInModalRifflandia
          isOpen={isSignInModalOpen}
          closeModal={closeSignInModal}
          handleRedirectToAuth={handleRedirectToAuthForBrowser}
        />

        <SpotifyPreviewModal artistId={spotifyPreviewArtistId} setArtistId={setSpotifyPreviewArtistId} />
      </Box>
    );
  }
};

const CreatePlaylistButton = ({ handleCreatePlaylist }: { handleCreatePlaylist: () => Promise<void> }) => {
  const [isPlaylistButtonShaking, setPlaylistButtonShaking] = useState(false);

  useEffect(() => {
    // Function to handle the shaking logic
    function shakePlaylistButton() {
      setPlaylistButtonShaking(true);

      // Reset the shaking animation after a delay (in this case, 2 seconds)
      setTimeout(() => {
        setPlaylistButtonShaking(false);
      }, 2000);
    }

    // Call the shakePlaylistButton function initially
    shakePlaylistButton();

    // Set the interval to call the shakePlaylistButton function every x milliseconds
    const intervalId = setInterval(shakePlaylistButton, 8000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Button
        onClick={handleCreatePlaylist}
        variant="contained"
        className={`${isPlaylistButtonShaking ? "shaking" : ""}`}
        sx={{
          ...PRIMARY_BUTTON_SX,
          width: "300px",
          marginTop: "16px",
          marginBottom: "16px",
          justifyContent: "center",
          height: "48px",
        }}
      >
        <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "8px" }} />
        <Typography sx={{ paddingBottom: 0 }}>Generate playlist</Typography>
      </Button>
    </>
  );
};

const BuyTicketsButton = () => (
  <Button className="buy_tickets" onClick={() => goToNewTab(TICKET_LINK)} variant="outlined" sx={{ width: "300px" }}>
    <Box sx={{ marginRight: "12px", height: "20px", width: "20px" }}>
      <CHERRIES />
    </Box>
    Buy Tickets
  </Button>
);

const SignOutButton = () => (
  <Button
    variant="outlined"
    sx={{
      marginTop: "16px",
      marginBottom: "16px",
      width: "300px",
    }}
    onClick={logOut}
  >
    Sign Out
  </Button>
);
