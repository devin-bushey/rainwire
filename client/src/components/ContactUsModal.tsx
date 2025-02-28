import { Modal, Input, TextField, Button } from "@mui/material";
import { Box } from "@mui/system";
import { useState, useContext } from "react";
import { SnackBarContext } from "../App";
import { PageClassName } from "../theme/AppStyles";
import { send } from "@emailjs/browser";

const DEFAULT_BACKGROUND_COLOUR = "#2596be";
const DEFAULT_PRIMARY_BUTTON_COLOUR = {
  backgroundColor: "#00AEEF",
  color: "black",
  ":hover": { backgroundColor: "#055972" },
};

type ContactUsModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  pageClassName?: PageClassName;
};

export const ContactUsModal = ({ isOpen, closeModal, pageClassName }: ContactUsModalProps) => {
  const [message, setMessage] = useState("");

  const [toSend, setToSend] = useState({
    from_name: "",
    reply_to: "",
    message: "",
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
        console.log("SUCCESS!", response.status, response.text);
      })
      .catch((err) => {
        console.log("FAILED...", err);
      })
      .finally(() => {
        snackBar.setSnackBar({
          showSnackbar: true,
          setShowSnackbar: () => true,
          message: "Request sent! We'll be in touch soon!",
          isError: false,
        });
        closeModal();
      });
  };

  const handleChange = (e: any) => {
    setToSend({ ...toSend, [e.target.name]: e.target.value });
  };

  return (
    <Modal open={isOpen} onClose={closeModal} className={`${pageClassName}`}>
      <Box
        className="contact-us-modal-contents"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "90%",
          minWidth: "300px",
          maxWidth: "550px",
          border: "2px solid #000",
          borderRadius: "10px",
          boxShadow: 24,
          p: 4,
          backgroundColor: DEFAULT_BACKGROUND_COLOUR,
        }}
      >
        <form onSubmit={onSubmit}>
          <Input
            name="from_name"
            placeholder="Your Name"
            value={toSend.from_name}
            onChange={handleChange}
            sx={{ width: "100%", maxWidth: "300px" }}
          />
          <br />
          <Input
            type="email"
            name="reply_to"
            placeholder="Your Email"
            value={toSend.reply_to}
            onChange={handleChange}
            sx={{ width: "100%", maxWidth: "300px", marginTop: "8px", marginBottom: "24px" }}
          />
          <br />
          <TextField placeholder="Message" onChange={(e) => setMessage(e.target.value)} multiline fullWidth />
          <br />
          <br />
          <Button
            type="submit"
            variant="contained"
            className="primary-button"
            sx={{
              marginTop: "8px",
              ...DEFAULT_PRIMARY_BUTTON_COLOUR,
            }}
          >
            Send
          </Button>
          <br />
        </form>
      </Box>
    </Modal>
  );
};
