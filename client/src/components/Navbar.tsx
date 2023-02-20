import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Box, IconButton, Typography, Menu } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { COLOURS } from '../theme/AppStyles';

const Navbarr = () => {
  const navigate = useNavigate();
  const logOut = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
        <Container>
          <Toolbar disableGutters>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Typography
                variant="h6"
                sx={{
                  textAlign: 'center',
                  borderRadius: '10px',
                  background: COLOURS.light_yellow,
                  padding: '3px 10px 3px 10px',
                  marginLeft: '24px',
                  mr: 2,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: COLOURS.black,
                }}
              >
                Record Shop
              </Typography>
            </Link>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, marginLeft: '24px' }}>
              <Button
                component={Link}
                to="/vic"
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: 'black',
                  display: 'block',
                  maxWidth: '75px',
                }}
              >
                Victoria
              </Button>
            </Box>

            {localStorage.getItem('encryptedSpotifyToken') && (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 0, marginRight: '24px' }}>
                <Button
                  variant="contained"
                  onClick={logOut}
                  sx={{ backgroundColor: COLOURS.light_yellow, color: COLOURS.black }}
                >
                  Sign Out
                </Button>
              </Box>
            )}

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'right' }}>
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
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  justifyContent: 'center',
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleCloseNavMenu}
                  component={Link}
                  to="/vic"
                  sx={{
                    color: 'black',
                    textAlign: 'center',
                    margin: '0px 4px',
                  }}
                >
                  Victoria
                </Button>

                {localStorage.getItem('encryptedSpotifyToken') && (
                  <Button
                    variant="contained"
                    onClick={logOut}
                    sx={{ backgroundColor: COLOURS.light_yellow, color: COLOURS.black, margin: '0px 4px' }}
                  >
                    Sign Out
                  </Button>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container sx={{ marginTop: '24px' }}>
        <Outlet />
      </Container>
    </>
  );
};

export default Navbarr;
