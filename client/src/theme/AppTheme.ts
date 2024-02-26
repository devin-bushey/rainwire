import { createTheme } from "@mui/material/styles";
import { COLOURS } from "./AppStyles";

export const AppTheme = createTheme({
  palette: {
    primary: {
      main: COLOURS.accent_04,
    },
    secondary: {
      main: COLOURS.accent_01,
    },
    text: {
      primary: COLOURS.black,
    },
  },
  typography: {
    fontFamily: ["Comfortaa", "sans-serif"].join(","),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "#ece7e1",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: "30px",
          borderRadius: "10px",
          marginBottom: "20px",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          paddingBottom: "8px",
        },
      },
    },
  },
});
