import { createTheme } from '@mui/material/styles';
import { COLOURS } from './AppStyles';

export const AppTheme = createTheme({
  palette: {
    background: {
      default: COLOURS.light_mode_white,
    },
    primary: {
      main: COLOURS.primary_blue,
    },
    secondary: {
      main: COLOURS.black,
    },
    text: {
      primary: COLOURS.white,
      secondary: COLOURS.black,
    },
  },
  typography: {
    fontFamily: ['Inconsolata', 'monospace', 'sans-serif'].join(','),
  },
  components: {
    // this works
    MuiCard: {
      styleOverrides: {
        root: {
          padding: '30px',
          borderRadius: '10px',
          marginBottom: '20px',
        },
      },
    },
  },
});
