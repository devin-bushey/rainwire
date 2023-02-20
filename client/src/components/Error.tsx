import { Container, Typography } from '@mui/material';

export const Error = () => {
  return (
    <Container sx={{ textAlign: 'center' }}>
      <Typography variant="h5" sx={{ color: 'black', textAlign: 'center', marginBottom: '8px' }}>
        Something went wrong ...
      </Typography>
    </Container>
  );
};
