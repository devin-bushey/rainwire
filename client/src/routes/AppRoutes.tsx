import { useEffect, useState } from 'react';
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
import { Festivals } from '../constants/enums';
import { About } from '../components/About';

export const AppRoutes = () => {
  const WEBSITE_VIC = 'https://thecapitalballroom.com/';
  const WEBSITE_VAN = 'https://redcat.ca/';
  // const WEBSITE_OTT = 'http://www.vertigorecords.ca/showtickets/index.html';

  //const ticketsVictoria = GetTickets('victoria');
  //const ticketsOttawa = GetTickets('ottawa');
  //const ticketsVancouver = GetTickets('vancouver');

  const [ticketsVictoria, setTicketsVictoria] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [ticketsVancouver, setTicketsVancouver] = useState<any>([]);
  const [isLoadingVan, setIsLoadingVan] = useState(true);
  const [isErrorVan, setIsErrorVan] = useState(false);

  const [ticketsPhilips, setTicketsPhilips] = useState<any>([]);
  const [isLoadingPhilips, setIsLoadingPhilips] = useState(true);
  const [isErrorPhilips, setIsErrorPhilips] = useState(false);

  useEffect(() => {
    GetTickets('victoria')
      .then((data) => {
        setTicketsVictoria(data);
        setIsLoading(false);
        setIsError(false);
        if (!data || data.length == 0) {
          setIsError(true);
        }
      })
      .catch((error) => {
        setIsError(true);
        setIsLoading(false);
      });

    GetTickets('vancouver')
      .then((data) => {
        setTicketsVancouver(data);
        setIsLoadingVan(false);
        setIsErrorVan(false);

        if (!data || data.length == 0) {
          setIsErrorVan(true);
        }
      })
      .catch((error) => {
        setIsErrorVan(true);
        setIsLoadingVan(false);
      });

    GetTickets(Festivals.PhilipsBackyard)
      .then((data) => {
        setTicketsPhilips(data);
        setIsLoadingPhilips(false);
        setIsErrorPhilips(false);

        if (!data || data.length == 0) {
          setIsErrorPhilips(true);
        }
      })
      .catch((error) => {
        setIsErrorPhilips(true);
        setIsLoadingPhilips(false);
      });
  }, []);

  const token = getSpotifyTokenLocalStorage();

  const displayVictoria = () => {
    if (isLoading) {
      return <Loading />;
    } else if (isError) {
      return <Error />;
    } else {
      return <DisplayTable tickets={ticketsVictoria} website={WEBSITE_VIC} city={'Victoria'} />;
    }
  };

  const displayVancouver = () => {
    if (isLoadingVan) {
      return <Loading />;
    } else if (isErrorVan) {
      return <Error />;
    } else {
      return <DisplayTable tickets={ticketsVancouver} website={WEBSITE_VIC} city={'Vancouver'} />;
    }
  };

  const displayPhilips = () => {
    if (isLoadingPhilips) {
      return <Loading />;
    } else if (isErrorPhilips) {
      return <Error />;
    } else {
      return <DisplayTable tickets={ticketsPhilips} website={''} city={'Philips Backyard'} />;
    }
  };

  return (
    <>
      <Box sx={{ minHeight: 'calc(100vh - 46px)' }}>
        <Routes>
          <Route path="/" element={<Navbarr />}>
            <Route index element={token != null && token != '' ? <CreatePlaylistPage /> : <MainPage />} />
            <Route path="/vic" element={displayVictoria()} />
            <Route path="/van" element={displayVancouver()} />
            <Route path="/philips" element={displayPhilips()} />
            {/* <Route path="/ottawa" element={<DisplayTable tickets={ticketsOttawa} website={WEBSITE_OTT} />} /> */}
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
