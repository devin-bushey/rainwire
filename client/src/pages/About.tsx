import { Box, Button, Card, Container, Input, Modal, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import { send } from 'emailjs-com';
import { memo, useContext, useEffect, useState } from 'react';
import { COLOURS } from '../theme/AppStyles';
import coffeeCup from '../assets/images/coffee-cup.png';
import { SnackBarContext } from '../App';

import { ReactComponent as CHERRIES } from '../Rifflandia/images/cherries.svg';
import { useNavigate } from 'react-router-dom';

export const About = memo(() => {
  const [openEmail, setOpenEmail] = useState(false);
  const handleOpen = () => setOpenEmail(true);
  const handleClose = () => setOpenEmail(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Record Shop | About';
    window.scrollTo(0, 0);
  }, []);

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
          Record Shop&apos;s name is inspired by the times when I would visit record stores to browse through concert
          listings, look up each unfamiliar band on Spotify, and then create a playlist with the top track from each
          artist.
        </Typography>
        <Typography sx={{ padding: '16px 0' }}>
          I would then listen to the playlist throughout the week and if an artist played with a song that I liked, I
          could go back to the record store and buy a ticket to their upcoming show. I could also remove songs from the
          playlist that didn&apos;t suit my taste.
        </Typography>
        <Typography sx={{ padding: '16px 0' }}>
          In the end, I was going to more live shows and I would end up with a playlist that I could put on repeat and
          share with friends!
        </Typography>
        <Typography sx={{ padding: '16px 0' }}>
          I wanted to automate part of this process - so I created Record Shop.
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
              sx={{ width: '200px', margin: '16px 0' }}
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
              Please keep in touch and let me know what you think of the website!
            </Typography>

            <Typography
              sx={{
                fontWeight: '500',
                fontSize: '1.25rem',
                textAlign: 'left',
                paddingBottom: '0px',
                marginBottom: '16px',
                marginTop: '8px',
              }}
            >
              Or if you&apos;re an artist and you want to add your show to the list then send me an email through the
              button below:
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {/* <Button
                href="https://www.linkedin.com/in/devin-bushey/"
                target="_blank"
                variant="outlined"
                sx={{ margin: '8px 0' }}
              >
                LinkedIn
              </Button> */}
              <Button
                onClick={handleOpen}
                variant="contained"
                color="secondary"
                sx={{ width: '200px', margin: '8px 0' }}
              >
                Email
              </Button>
            </Box>
          </Box>
        </Card>

        <Card
          sx={{
            marginTop: '16px',
            backgroundColor: COLOURS.card_colours[0],
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
              Record Shop is in the news and on social media!
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              <Button
                href="https://www.vicnews.com/local-news/victoria-software-developer-creates-tool-to-get-music-fans-out-to-concerts-3089731"
                target="_blank"
                variant="contained"
                color="secondary"
                sx={{ width: '200px', margin: '16px 0', marginRight: '16px' }}
              >
                Victoria News
              </Button>

              <Button
                href="https://www.victoriabuzz.com/2023/08/victoria-developer-creates-website-to-connect-music-lovers-to-bands-that-are-playing-in-town/"
                target="_blank"
                variant="contained"
                color="secondary"
                sx={{ width: '200px', margin: '16px 0', marginRight: '16px' }}
              >
                Victoria Buzz
              </Button>

              <Button
                href="https://www.instagram.com/p/CvdPr81MlCB/"
                target="_blank"
                variant="contained"
                color="secondary"
                sx={{ width: '200px', margin: '16px 0', marginRight: '16px' }}
              >
                Riff&apos;s Instagram
              </Button>

              <Button
                href="https://open.spotify.com/user/31ma23i46a3p3vmxvvq7qmhk7w3q"
                target="_blank"
                variant="contained"
                color="secondary"
                sx={{ width: '200px', margin: '16px 0' }}
              >
                Spotify
              </Button>
            </Box>
          </Box>
        </Card>

        <Card
          sx={{
            marginTop: '16px',
            backgroundColor: COLOURS.card_colours[2],
          }}
        >
          <Box sx={{ minHeight: '60px', marginBottom: '8px' }}>
            <Typography sx={{ fontWeight: '700', paddingTop: '12px' }}>
              Checkout the exclusive page that was created for Rifflandia:
            </Typography>

            <Button
              onClick={() => {
                navigate('/rifflandia');
              }}
              variant="contained"
              color="secondary"
              sx={{ marginTop: '12px', marginBottom: '24px', padding: '8px 16px', width: '200px' }}
            >
              <Box sx={{ marginRight: '12px', height: '20px', width: '20px' }}>
                <CHERRIES />
              </Box>
              Rifflandia
            </Button>
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
            {/* <Typography sx={{ marginBottom: '8px' }}>To devin.m.bushey@gmail.com</Typography> */}
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
