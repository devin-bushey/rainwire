import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Navbarr from "../components/Navbar";
import NotFound from "../pages/NotFound";
import { Box } from "@mui/material";
import { ArtistsPage } from "../pages/ArtistsPage";
import useSpotifyAuth from "../hooks/useSpotifyAuth";
import useAnalytics from "../hooks/useAnalytics";
import { Rifflandia } from "../Rifflandia/pages/Rifflandia";
import { SampleFestival } from "../festivals/SampleFestival/SampleFestival";

export const AppRoutes = () => {
  useAnalytics();
  const { token, spotifyInfo } = useSpotifyAuth();

  return (
    <>
      <Box sx={{ minHeight: "calc(100vh - 46px)" }}>
        <Routes>
          <Route path="/" element={<Navbarr />}>
            <Route index element={!token || !spotifyInfo || !spotifyInfo.access ? <LoginPage /> : <ArtistsPage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            {/* <Route path="/about" element={<About />} /> */}
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/rifflandia" element={<Rifflandia />} />
          <Route path="/test" element={<SampleFestival />} />
        </Routes>
      </Box>
    </>
  );
};
