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
                  background: COLOURS.accent_01,
                  padding: '3px 10px 3px 10px',
                  marginLeft: '16px',
                  mr: 2,
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
                to="/tickets"
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: 'black',
                  display: 'block',
                  maxWidth: '175px',
                  marginLeft: '16px',
                }}
              >
                Artists
              </Button>
              {/* <Button
                component={Link}
                to="/philips"
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: 'black',
                  display: 'block',
                  maxWidth: '175px',
                  marginLeft: '16px',
                }}
              >
                Philips Backyard
              </Button>

              <Button
                component={Link}
                to="/whistle"
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: 'black',
                  display: 'block',
                  maxWidth: '175px',
                }}
              >
                Whistlemania
              </Button>

              <Button
                component={Link}
                to="/vic"
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: 'black',
                  display: 'block',
                  maxWidth: '150px',
                }}
              >
                Victoria
              </Button>

              <Button
                component={Link}
                to="/van"
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: 'black',
                  display: 'block',
                  maxWidth: '150px',
                }}
              >
                Vancouver
              </Button> */}

              <Button
                component={Link}
                to="/about"
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: 'black',
                  display: 'block',
                  maxWidth: '75px',
                }}
              >
                About
              </Button>
            </Box>

            {localStorage.getItem('encryptedSpotifyToken') && (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 0, marginRight: '24px' }}>
                <Button variant="outlined" onClick={logOut}>
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
                <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column' }}>
                  <Button
                    variant="outlined"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to="/tickets"
                    sx={{
                      color: 'black',
                      textAlign: 'center',
                      margin: { xs: '4px 4px', md: '0px 4px' },
                    }}
                  >
                    Artists
                  </Button>
                  {/* <Button
                    variant="outlined"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to="/philips"
                    sx={{
                      color: 'black',
                      textAlign: 'center',
                      margin: { xs: '4px 4px', md: '0px 4px' },
                    }}
                  >
                    Philips Backyard
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to="/whistle"
                    sx={{
                      color: 'black',
                      textAlign: 'center',
                      margin: { xs: '4px 4px', md: '0px 4px' },
                    }}
                  >
                    Whistlemania
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to="/vic"
                    sx={{
                      color: 'black',
                      textAlign: 'center',
                      margin: { xs: '4px 4px', md: '0px 4px' },
                    }}
                  >
                    Victoria
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to="/van"
                    sx={{
                      color: 'black',
                      textAlign: 'center',
                      margin: { xs: '4px 4px', md: '0px 4px' },
                    }}
                  >
                    Vancouver
                  </Button> */}

                  <Button
                    variant="outlined"
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to="/about"
                    sx={{
                      color: 'black',
                      textAlign: 'center',
                      margin: { xs: '4px 4px', md: '0px 4px' },
                    }}
                  >
                    About
                  </Button>

                  {localStorage.getItem('encryptedSpotifyToken') && (
                    <Button
                      variant="contained"
                      onClick={logOut}
                      sx={{ backgroundColor: COLOURS.accent_01, color: COLOURS.black, margin: '4px 4px' }}
                    >
                      Sign Out
                    </Button>
                  )}
                </Box>
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
