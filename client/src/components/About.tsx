import { Box, Button, Card, Container, Input, Modal, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import { send } from 'emailjs-com';
import { memo, useContext, useState } from 'react';
import { COLOURS } from '../theme/AppStyles';
import coffeeCup from '../assets/images/coffee-cup.png';
import { SnackBarContext } from '../App';

export const About = memo(() => {
  const [openEmail, setOpenEmail] = useState(false);
  const handleOpen = () => setOpenEmail(true);
  const handleClose = () => setOpenEmail(false);
  const [message, setMessage] = useState('');

  const [toSend, setToSend] = useState({
    from_name: '',
    reply_to: '',
    message: '',
  });

  const serviceID = import.meta.env.VITE_EMAIL_SERVICEID;
  const templateID = import.meta.env.VITE_EMAIL_TEMPLATEID;
  const pubkey = import.meta.env.VITE_EMAIL_PUBKEY;

  const snackBar = useContext(SnackBarContext);

  const onSubmit = (e: any) => {
    e.preventDefault();
    toSend.message = message;
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
        handleClose();
      });
  };

  const handleChange = (e: any) => {
    setToSend({ ...toSend, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="lg" sx={{ marginBottom: '48px' }}>
      <Typography variant="h3" sx={{ color: COLOURS.accent_02 }}>
        About
      </Typography>

      <Box
        sx={{
          width: { md: '100%', lg: '75%' },
          maxWidth: '700px',
          '& .MuiTypography-body1': {
            fontSize: '1.25rem',
          },
        }}
      >
        <Typography sx={{ padding: '16px 0' }}>
          Record Shop got its name from when I would go to record stores to browse through concert listings, look up
          each band on Spotify, and then create a playlist with the top track from each artist.
        </Typography>
        <Typography sx={{ padding: '16px 0' }}>
          If a new artist played with a song that I liked, I could go back to the record store and buy a ticket.
        </Typography>
        <Typography sx={{ padding: '16px 0' }}>
          I wanted to automate part of this process, so I created Record Shop!
        </Typography>

        <Card
          sx={{
            marginTop: '16px',
            backgroundColor: COLOURS.card_colours[1],
          }}
        >
          <Box sx={{ minHeight: '60px', marginBottom: '8px' }}>
            <Typography
              sx={{
                fontWeight: '700',
                fontSize: '1.25rem',
                textAlign: 'left',
                paddingBottom: '0px',
                marginBottom: '8px',
              }}
            >
              If you like Record Shop, please consider buying me a coffee!
            </Typography>
            <Button
              href="https://bmc.link/buushh"
              target="_blank"
              variant="contained"
              color="secondary"
              sx={{ margin: '16px 0' }}
            >
              <img src={coffeeCup} alt="coffee" width="20px" height="20px" style={{ marginRight: '8px' }} />
              Buy me a coffee
            </Button>
            <Typography
              sx={{
                fontWeight: '700',
                fontSize: '1.25rem',
                textAlign: 'left',
                paddingBottom: '0px',
                marginBottom: '16px',
                marginTop: '8px',
              }}
            >
              Or keep in touch through the links below:
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', width: '125px' }}>
              <Button
                href="https://www.linkedin.com/in/devin-bushey/"
                target="_blank"
                variant="outlined"
                sx={{ margin: '8px 0' }}
              >
                LinkedIn
              </Button>
              <Button onClick={handleOpen} variant="outlined" sx={{ margin: '8px 0' }}>
                Email
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>

      <Modal
        open={openEmail}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <form onSubmit={onSubmit}>
            <Input
              name="from_name"
              placeholder="Your Name"
              value={toSend.from_name}
              onChange={handleChange}
              sx={{ backgroundColor: 'white', width: '300px' }}
            />
            <br />
            <Input
              type="email"
              name="reply_to"
              placeholder="Your Email"
              value={toSend.reply_to}
              onChange={handleChange}
              sx={{ backgroundColor: 'white', width: '300px', marginTop: '8px', marginBottom: '24px' }}
            />
            <br />
            <Typography sx={{ marginBottom: '8px' }}>To devin.m.bushey@gmail.com</Typography>
            <TextField placeholder="Message" onChange={(e) => setMessage(e.target.value)} multiline fullWidth />
            <br />
            <br />
            <Button type="submit" variant="contained" color="secondary" sx={{ marginTop: '8px' }}>
              Send
            </Button>
            <br />
          </form>
        </Box>
      </Modal>
    </Container>
  );
});

About.displayName = 'About';
