import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { AppBar, Toolbar, Button, Container, Box, IconButton, Menu, Typography, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { COLOURS, primaryButtonColours, secondaryButtonColours } from "../theme/AppStyles";
import spotifyIcon from "../spotifyLogos/Spotify_Icon_RGB_Black.png";
import { redirectToAuth, isLoggedIntoSpotify, logOut } from "../utils/spotifyAuthUtils";
import useSpotifyAuth from "../hooks/useSpotifyAuth";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ContactUsModal } from "../Rifflandia/ContactUsModal";

type MenuProps = {
  handleOpenEmail: () => void;
};

const Navbarr = () => {
  const [openEmail, setOpenEmail] = useState(false);
  const handleOpenEmail = () => setOpenEmail(true);

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "transparent",
          boxShadow: "none",
          padding: "15px 0 0 0",
        }}
      >
        <Container>
          <Toolbar>
            <HeaderMenu handleOpenEmail={handleOpenEmail} />

            <DropdownMenu handleOpenEmail={handleOpenEmail} />
          </Toolbar>
        </Container>
      </AppBar>

      <ContactUsModal isOpen={openEmail} setOpenEmail={setOpenEmail} />

      <Container sx={{ marginTop: "24px" }}>
        <Outlet />
      </Container>
    </>
  );
};

const HeaderMenu = ({ handleOpenEmail }: MenuProps) => {
  const optionButtonAppearance = {
    my: 2,
    color: "black",
    display: "block",
    maxWidth: "175px",
    alignSelf: "center",
  };

  const NavBarMenuOption = (label: string, toPage: string) => (
    <Button component={Link} to={toPage} sx={optionButtonAppearance}>
      {label}
    </Button>
  );

  return (
    <>
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexGrow: 1,
          margin: "0 16px",
        }}
      >
        {NavBarMenuOption("Home", "/")}
        {NavBarMenuOption("Victoria", "/artists")}
        {NavBarMenuOption("Explore", "/explore")}
        <Button sx={optionButtonAppearance} onClick={handleOpenEmail}>
          Contact me
        </Button>
      </Box>

      <ProfileMenu />
    </>
  );
};

const ProfileMenu = () => {
  const { spotifyInfo } = useSpotifyAuth();

  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const isProfileMenuOpen = Boolean(profileMenuAnchor);

  const openProfileMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };
  const closeProfileMenu = () => {
    setProfileMenuAnchor(null);
  };

  const SignInButton = (
    <Button
      onClick={() => redirectToAuth()}
      variant="contained"
      sx={{
        ...primaryButtonColours,
        width: "150px",
        height: "48px",
        alignSelf: "center",
      }}
    >
      <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "8px" }} />
      <Typography sx={{ paddingBottom: 0 }}>Sign in</Typography>
    </Button>
  );

  const ProfileMenu = (
    <Box>
      <Button id="profile-button" onClick={openProfileMenu} endIcon={<KeyboardArrowDownIcon />}>
        Welcome {spotifyInfo.firstName || spotifyInfo.user_name}
      </Button>
      <Menu
        id="profile-menu"
        anchorEl={profileMenuAnchor}
        open={isProfileMenuOpen}
        onClose={closeProfileMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Button onClick={logOut} sx={{ width: "120px", height: "30px", margin: "0 10px" }}>
          Sign out
        </Button>
      </Menu>
    </Box>
  );

  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        flexGrow: 0,
        color: COLOURS.black,
      }}
    >
      {isLoggedIntoSpotify() ? ProfileMenu : SignInButton}
    </Box>
  );
};

const DropdownMenu = ({ handleOpenEmail }: MenuProps) => {
  const [navMenuAnchor, setNavMenuAnchor] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNavMenuAnchor(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setNavMenuAnchor(null);
  };

  const optionButtonAppearance = {
    color: COLOURS.black,
    margin: { xs: "4px 4px", md: "0px 4px" },
  };

  const accountButtonAppearance = {
    width: "140px",
    height: "45px",
    alignSelf: "center",
    margin: "15px 30px 10px 30px",
  };

  const NavBarDropdownMenuOption = (label: string, toPage: string) => (
    <Button onClick={handleCloseNavMenu} component={Link} to={toPage} sx={optionButtonAppearance}>
      {label}
    </Button>
  );

  const SignInButton = (
    <Button
      onClick={() => redirectToAuth()}
      variant="contained"
      sx={{
        ...accountButtonAppearance,
        ...primaryButtonColours,
      }}
    >
      <img src={spotifyIcon} alt="spotify_logo" width="20px" height="20px" style={{ marginRight: "8px" }} />
      <Typography sx={{ paddingBottom: 0 }}>Sign in</Typography>
    </Button>
  );

  const SignOutButton = (
    <Button
      variant="contained"
      onClick={logOut}
      sx={{
        ...accountButtonAppearance,
        ...secondaryButtonColours,
      }}
    >
      Sign Out
    </Button>
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: { xs: "flex", md: "none" },
        justifyContent: "right",
      }}
    >
      <IconButton
        size="large"
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="primary"
      >
        <MenuIcon />
      </IconButton>

      <Menu
        id="menu-appbar"
        anchorEl={navMenuAnchor}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(navMenuAnchor)}
        onClose={handleCloseNavMenu}
        sx={{
          display: { xs: "flex", md: "none" },
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            flexDirection: "column",
          }}
        >
          {NavBarDropdownMenuOption("Home", "/")}
          {NavBarDropdownMenuOption("Victoria", "/artists")}
          {NavBarDropdownMenuOption("Explore", "/explore")}

          <Button
            sx={optionButtonAppearance}
            onClick={() => {
              handleOpenEmail();
              handleCloseNavMenu();
            }}
          >
            Contact me
          </Button>

          {isLoggedIntoSpotify() ? SignOutButton : SignInButton}
        </Box>
      </Menu>
    </Box>
  );
};

export default Navbarr;
