import { Container } from '@mui/material';
import './styles/Loading.css';

export const Loading = () => {
  return (
    <Container sx={{ textAlign: 'center' }}>
      <p>L O A D I N G</p>
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
