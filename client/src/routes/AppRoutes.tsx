import { Routes, Route } from "react-router-dom";
import WelcomePage from "../pages/WelomePage";
import Navbarr from "../components/Navbar";
import NotFound from "../pages/NotFound";
import { Box } from "@mui/material";
import { ArtistsPage } from "../pages/ArtistsPage";
import { FestivalPage } from "../pages/FestivalPage";
import useAnalytics from "../hooks/useAnalytics";
import { Rifflandia } from "../Rifflandia/pages/Rifflandia";
import { PachenaBay } from "../festivals/PachenaBay/PachenaBay";
import { PhillipsBackyard } from "../festivals/PhillipsBackyard/PhillipsBackyard";

export const AppRoutes = () => {
  useAnalytics();
  return (
    <>
      <Box sx={{ minHeight: "calc(100vh - 46px)" }}>
        <Routes>
          <Route path="/" element={<Navbarr />}>
            <Route index element={<WelcomePage />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/festivals" element={<FestivalPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/rifflandia" element={<Rifflandia />} />
          <Route path="/pachenabay" element={<PachenaBay />} />
          <Route path="/phillipsbackyard" element={<PhillipsBackyard />} />
        </Routes>
      </Box>
    </>
  );
};
