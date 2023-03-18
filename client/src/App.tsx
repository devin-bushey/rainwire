import { ThemeProvider } from '@emotion/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { AppTheme } from './theme/AppTheme';
import { CssBaseline } from '@mui/material/';
import { createContext, Dispatch, useState, useEffect } from 'react';
import { SnackBar, SnackBarOptions } from './components/SnackBar';

export const SnackBarContext = createContext({
  setSnackBar: (() => undefined) as Dispatch<SnackBarOptions>,
});

const App = () => {
  // Globally used SnackBar component
  const [snackBar, setSnackBar] = useState<SnackBarOptions>({
    showSnackbar: false,
    setShowSnackbar: () => undefined,
    message: '',
    isError: false,
  });
  // Needed the following usestate and useffect code so that the snackbar would disapear/close
  const [displaySnackBar, setDisplaySnackBar] = useState(false);
  useEffect(() => {
    setDisplaySnackBar(snackBar.showSnackbar);
  }, [snackBar]);

  return (
    <ThemeProvider theme={AppTheme}>
      <SnackBarContext.Provider value={{ setSnackBar: setSnackBar }}>
        <SnackBar
          showSnackbar={displaySnackBar}
          setShowSnackbar={setDisplaySnackBar}
          message={snackBar.message}
          isError={snackBar.isError}
        />

        <CssBaseline />
        <Router>
          <AppRoutes />
        </Router>
      </SnackBarContext.Provider>
    </ThemeProvider>
  );
};

export default App;
