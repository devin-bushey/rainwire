import { Routes, Route } from 'react-router-dom';
import MainPage from '../components/MainPage';
import Navbarr from '../components/Navbar';
import NotFound from '../components/NotFound';
import Refresh from '../components/Refresh';
import { Box } from '@mui/material';
import { About } from '../components/About';
import { DisplayTickets } from '../components/DisplayTickets';
import useSpotifyAuth from '../hooks/useSpotifyAuth';
import { CreatePlaylistPage } from '../components/CreatePlaylistPage';
import useAnalytics from '../hooks/useAnalytics';
import { Rifflandia } from '../components/Rifflandia';

export const AppRoutes = () => {
  useAnalytics();
  const { token } = useSpotifyAuth();

  return (
    <>
      <Box sx={{ minHeight: 'calc(100vh - 46px)' }}>
        <Routes>
          <Route path="/" element={<Navbarr />}>
            <Route index element={token != null && token != '' ? <CreatePlaylistPage /> : <MainPage />} />
            <Route path="/tickets" element={<DisplayTickets />} />
            <Route path="/about" element={<About />} />
            <Route path="/refresh" element={<Refresh />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/rifflandia" element={<Rifflandia />} />
        </Routes>
      </Box>
    </>
  );
};
