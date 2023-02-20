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

export const AppRoutes = () => {
  const WEBSITE_VIC = 'https://thecapitalballroom.com/';
  // const WEBSITE_VAN = 'https://redcat.ca/';
  // const WEBSITE_OTT = 'http://www.vertigorecords.ca/showtickets/index.html';

  //const ticketsVictoria = GetTickets('victoria');
  //const ticketsOttawa = GetTickets('ottawa');
  //const ticketsVancouver = GetTickets('vancouver');

  const [tickets, setTickets] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    GetTickets('victoria')
      .then((data) => {
        setTickets(data);
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
  }, []);

  const token = getSpotifyTokenLocalStorage();

  const displayElement = () => {
    if (isLoading) {
      return <Loading />;
    } else if (isError) {
      return <Error />;
    } else {
      return <DisplayTable tickets={tickets} website={WEBSITE_VIC} />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Navbarr />}>
        <Route index element={token != null && token != '' ? <CreatePlaylistPage /> : <MainPage />} />
        <Route path="/vic" element={displayElement()} />
        {/* <Route path="/van" element={<DisplayTable tickets={ticketsVancouver} website={WEBSITE_VAN} />} />
          <Route path="/ottawa" element={<DisplayTable tickets={ticketsOttawa} website={WEBSITE_OTT} />} /> */}
        <Route path="/refresh" element={<Refresh />} />
        <Route path="/create" element={<CreatePlaylistPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};
