import { ThemeProvider } from '@emotion/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { AppTheme } from './theme/AppTheme';
import { CssBaseline } from '@mui/material/';

const App = () => {
  return (
    <ThemeProvider theme={AppTheme}>
      <CssBaseline />
      <Router>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
};

export default App;
