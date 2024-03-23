import { useState } from "react";
import PropTypes from "prop-types";
import { Dialog } from "@mui/material";
import SettingsModalHeader from "./SettingsModalHeader";
import SettingsModalContent from "./SettingsModalContent";

export default function SettingsModal({ open, handleClose }) {
  const [content, setContent] = useState("Général");

  const handleClick = (e) => {
    setContent(e.target.innerText);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth={false}
      aria-labelledby="settings-dialog"
      PaperProps={{
        sx: {
          bgcolor: "modal.background",
          width: ["75svw", "75svw", "70svw", "60svw"],
          maxHeight: ["80svh", "80svh", "70svh", "60svh"],
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem",
        },
      }}
    >
      <SettingsModalHeader content={content} handleClick={handleClick} />
      <SettingsModalContent content={content} />
    </Dialog>
  );
}

SettingsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
