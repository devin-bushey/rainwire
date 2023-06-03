import { ThemeProvider } from '@emotion/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';
import { AppTheme } from './theme/AppTheme';
import { CssBaseline } from '@mui/material/';
import { createContext, Dispatch, useState, useEffect } from 'react';
import { SnackBar, SnackBarOptions } from './components/SnackBar';
import { QueryClient, QueryClientProvider } from 'react-query';

export const SnackBarContext = createContext({
  setSnackBar: (() => undefined) as Dispatch<SnackBarOptions>,
});

const App = () => {
  // react query client for caching
  const queryClient = new QueryClient();

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
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
