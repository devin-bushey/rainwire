import { Box, Button, Menu } from "@mui/material";
import { logOut } from "../utils/spotifyAuthUtils";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import useSpotifyAuth from "../hooks/useSpotifyAuth";

export const ProfileMenu = () => {
  const { spotifyInfo } = useSpotifyAuth();

  const [profileMenuAnchor, setProfileMenuAnchor] = useState<null | HTMLElement>(null);
  const isProfileMenuOpen = Boolean(profileMenuAnchor);

  const openProfileMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };
  const closeProfileMenu = () => {
    setProfileMenuAnchor(null);
  };

  return (
    <Box className="profile-menu-button">
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
};
