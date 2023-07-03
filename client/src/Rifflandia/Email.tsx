import { Modal, Input, TextField, Button } from '@mui/material';
import { Box } from '@mui/system';
import { send } from 'emailjs-com';
import { useState, useContext } from 'react';
import { RIFFLANDIA_COLOURS } from './constants/colours';
import { SnackBarContext } from '../App';

export const Email = (props: any) => {
  const [message, setMessage] = useState('');
  const handleCloseEmail = () => props.setOpenEmail(false);

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
        handleCloseEmail();
      });
  };

  const handleChange = (e: any) => {
    setToSend({ ...toSend, [e.target.name]: e.target.value });
  };

  return (
    <Modal
      open={props.openEmail}
      onClose={handleCloseEmail}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '300px',
          maxWidth: '550px',
          backgroundColor: RIFFLANDIA_COLOURS.fill_pale_green,
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
            sx={{ width: '300px' }}
          />
          <br />
          <Input
            type="email"
            name="reply_to"
            placeholder="Your Email"
            value={toSend.reply_to}
            onChange={handleChange}
            sx={{ width: '300px', marginTop: '8px', marginBottom: '24px' }}
          />
          <br />
          {/* <Typography sx={{ marginBottom: '8px' }}>To devin.m.bushey@gmail.com</Typography> */}
          <TextField placeholder="Message" onChange={(e) => setMessage(e.target.value)} multiline fullWidth />
          <br />
          <br />
          <Button type="submit" variant="contained" sx={{ backgroundColor: RIFFLANDIA_COLOURS.blue, marginTop: '8px' }}>
            Send
          </Button>
          <br />
        </form>
      </Box>
    </Modal>
  );
};
