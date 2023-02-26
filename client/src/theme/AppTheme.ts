import { createTheme } from '@mui/material/styles';
import { COLOURS } from './AppStyles';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

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
    fontFamily: ['Comfortaa', 'sans-serif'].join(','),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // [theme.breakpoints.up('sm')]: {
          //   background: 'linear-gradient(90deg, #2C2A32 30%, #683159 10%)',
          // },

          // background: '#683159',
          background: '#ece7e1',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: '30px',
          borderRadius: '10px',
          marginBottom: '20px',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          paddingBottom: '8px',
        },
      },
    },
  },
});
