import { Container, Typography } from '@mui/material';

export const ErrorJamBase = () => {
  return (
    <Container sx={{ textAlign: 'center' }}>
      <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: '8px' }}>
        Whoops! Could not find any shows ...
      </Typography>
      <Typography sx={{ textAlign: 'center', marginBottom: '8px' }}>try searching a different city!</Typography>
    </Container>
  );
};
