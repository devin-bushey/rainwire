import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { GetTickets } from '../apiManager/RecordShop';
import CreatePlaylistPage from '../components/CreatePlaylistPage';
import DisplayTable from '../components/DisplayTable';
import { Loading } from '../components/Loading';
import MainPage from '../components/MainPage';
import Navbarr from '../components/Navbar';
import NotFound from '../components/NotFound';
import Refresh from '../components/Refresh';
import { Error } from '../components/Error';
import { getSpotifyTokenLocalStorage } from '../utils/tokenHandling';
import SignUp from '../components/SignUp';
import Footer from '../components/Footer';
import { Box } from '@mui/material';
import { Cities, Festivals } from '../constants/enums';
import { About } from '../components/About';
import { UseQueryOptions, UseQueryResult, useQuery } from 'react-query';
import { DisplayTickets } from '../components/DisplayTickets';

export const AppRoutes = () => {
  const token = getSpotifyTokenLocalStorage();

  const WEBSITE_PHILIPS = 'https://www.phillipsbackyard.com/';
  const WEBSITE_WHISTLE = 'https://www.eventbrite.ca/e/whistlemania-2023-tickets-623971705167/';

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

  useEffect(() => {
    victoriaQuery.refetch();
    vancouverQuery.refetch();
    philipsQuery.refetch();
    whistleQuery.refetch();
  }, []);

  const display = (query: UseQueryResult<any, unknown>, displayName: string, website?: string) => {
    if (query.isLoading) {
      return <Loading />;
      //else if (query.isError || query.data == null || query.data.length == 0) {
    } else if (query.isError) {
      return <Error />;
    } else {
      return <DisplayTable tickets={query.data} website={website} city={displayName} />;
    }
  };

  const display2 = (query: UseQueryResult<any, unknown>, displayName: string, website?: string) => {
    if (query.isLoading) {
      return <Loading />;
      //else if (query.isError || query.data == null || query.data.length == 0) {
    } else if (query.isError) {
      return <Error />;
    } else {
      return <DisplayTickets tickets={query.data} website={website} city={displayName} query={query} />;
    }
  };

  return (
    <>
      <Box sx={{ minHeight: 'calc(100vh - 46px)' }}>
        <Routes>
          <Route path="/" element={<Navbarr />}>
            <Route index element={token != null && token != '' ? <CreatePlaylistPage /> : <MainPage />} />
            {/* <Route path="/vic" element={display(victoriaQuery, 'Victoria, BC')} />
            <Route path="/van" element={display(vancouverQuery, 'Vancouver, BC')} />
            <Route path="/philips" element={display(philipsQuery, 'Philips Backyard', WEBSITE_PHILIPS)} />
            <Route path="/whistle" element={display(whistleQuery, 'Whistlemania', WEBSITE_WHISTLE)} /> */}
            <Route path="/tickets" element={display2(philipsQuery, 'Philips Backyard', WEBSITE_PHILIPS)} />
            <Route path="/about" element={<About />} />
            <Route path="/refresh" element={<Refresh />} />
            <Route path="/create" element={<CreatePlaylistPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Box>
      <Footer />
    </>
  );
};
