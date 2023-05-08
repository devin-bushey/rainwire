import { Box, Container, Input } from '@mui/material';
import Button from '@mui/material/Button/Button';
import Typography from '@mui/material/Typography';
import { send } from 'emailjs-com';
import { memo, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SnackBarContext } from '../App';
import { COLOURS } from '../theme/AppStyles';

const SignUp = memo(() => {
  const navigate = useNavigate();

  const [toSend, setToSend] = useState({
    from_name: '',
    reply_to: '',
  });

  const serviceID = import.meta.env.VITE_EMAIL_SERVICEID;
  const templateID = import.meta.env.VITE_EMAIL_TEMPLATEID;
  const pubkey = import.meta.env.VITE_EMAIL_PUBKEY;

  const snackBar = useContext(SnackBarContext);

  const onSubmit = (e: any) => {
    e.preventDefault();
    send(serviceID, templateID, toSend, pubkey)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
      })
      .catch((err) => {
        console.log('FAILED...', err);
      })
      .finally(() => {
        snackBar.setSnackBar({
          showSnackbar: true,
          setShowSnackbar: () => true,
          message: "Request sent! We'll be in touch soon!",
          isError: false,
        });
        navigate('/');
      });
  };

  const handleChange = (e: any) => {
    setToSend({ ...toSend, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="lg" sx={{ marginBottom: '32px' }}>
      <Typography variant="h3" sx={{ fontSize: '4rem' }}>
        Sign Up
      </Typography>
      <Typography sx={{ color: COLOURS.blue, fontWeight: '700', fontSize: '2rem' }}>
        Please make sure you include the email associated with your Spotify account.
      </Typography>

      <Box
        sx={{
          width: '75%',
          maxWidth: '700px',
          '& .MuiTypography-body1': {
            fontSize: '1.25rem',
          },
        }}
      >
        <form onSubmit={onSubmit}>
          <Input
            name="from_name"
            placeholder="Name"
            value={toSend.from_name}
            onChange={handleChange}
            sx={{ backgroundColor: 'white', width: '300px' }}
          />
          <br />
          <Input
            type="email"
            name="reply_to"
            placeholder="Email"
            value={toSend.reply_to}
            onChange={handleChange}
            sx={{ backgroundColor: 'white', width: '300px', marginTop: '8px', marginBottom: '16px' }}
          />
          <br />
          <Button type="submit" variant="contained" color="secondary" sx={{ marginTop: '8px' }}>
            Submit
          </Button>
        </form>

        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          May take a day or two to receive a confirmation email
        </Typography>
      </Box>
    </Container>
  );
});

SignUp.displayName = 'SignUp';

export default SignUp;
