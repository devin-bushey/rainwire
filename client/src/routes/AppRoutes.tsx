import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loading } from '../components/Loading';
import MainPage from '../components/MainPage';
import Navbarr from '../components/Navbar';
import NotFound from '../components/NotFound';
import Refresh from '../components/Refresh';
import { Error } from '../components/Error';
import { Box } from '@mui/material';
import { About } from '../components/About';
import { UseQueryResult } from 'react-query';
import { DisplayTickets } from '../components/DisplayTickets';
import useSpotifyAuth from '../hooks/useSpotifyAuth';
import useTicketQueries from '../hooks/useTicketQueries';
import { WEBSITE_PHILIPS, WEBSITE_RIFFLANDIA } from '../constants/locations';
import { CreatePlaylistPage } from '../components/CreatePlaylistPage';
import useAnalytics from '../hooks/useAnalytics';
import { Rifflandia } from '../components/Rifflandia';
import { LoadingRifflandia } from '../components/Rifflandia/LoadingRifflandia';

/**
 * Loads Phillips Backyyard tickets on app load
 * @returns
 */
export const AppRoutes = () => {
  useAnalytics();
  const { token } = useSpotifyAuth();
  const { philipsQuery, rifflandiaQuery } = useTicketQueries();

  useEffect(() => {
    philipsQuery.refetch();
    rifflandiaQuery.refetch();
  }, []);

  const display = (query: UseQueryResult<any, unknown>, displayName: string, website?: string) => {
    if (query.isLoading) {
      return <Loading />;
    } else if (query.isError) {
      return <Error />;
    } else {
      return <DisplayTickets tickets={query.data} website={website} city={displayName} query={query} />;
    }
  };

  const displayRifflandia = (query: UseQueryResult<any, unknown>, displayName: string, website?: string) => {
    if (query.isLoading) {
      return <LoadingRifflandia />;
    } else if (query.isError) {
      return <Error />;
    } else {
      return <Rifflandia tickets={query.data} website={website} city={displayName} query={query} />;
    }
  };

  return (
    <>
      <Box sx={{ minHeight: 'calc(100vh - 46px)' }}>
        <Routes>
          <Route path="/" element={<Navbarr />}>
            <Route index element={token != null && token != '' ? <CreatePlaylistPage /> : <MainPage />} />
            <Route path="/tickets" element={display(philipsQuery, 'Philips Backyard', WEBSITE_PHILIPS)} />
            <Route path="/about" element={<About />} />
            <Route path="/refresh" element={<Refresh />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/rifflandia" element={displayRifflandia(rifflandiaQuery, 'Rifflandia', WEBSITE_RIFFLANDIA)} />
        </Routes>
      </Box>
    </>
  );
};
