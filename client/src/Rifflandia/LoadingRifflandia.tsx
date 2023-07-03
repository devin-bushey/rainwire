import { Container, Typography } from '@mui/material';
import '../styles/Loading.css';

export const LoadingRifflandia = () => {
  return (
    <Container sx={{ paddingTop: '100px', textAlign: 'center' }}>
      <Typography variant="h5" sx={{ color: 'black', textAlign: 'center', marginBottom: '8px' }}>
        L O A D I N G
      </Typography>
      <div className="loader">
        <ul className="wine_ul">
          <li className="wine_li wine_li_1"></li>
          <li className="wine_li wine_li_2"></li>
          <li className="wine_li wine_li_3"></li>
        </ul>
        <div className="wineglass wine_left">
          <div className="wine_top"></div>
        </div>
        <div className="wineglass wine_right">
          <div className="wine_top"></div>
        </div>
      </div>
    </Container>
  );
};
