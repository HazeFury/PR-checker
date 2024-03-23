import { useState } from "react";
import PropTypes from "prop-types";
import { Dialog } from "@mui/material";
import { useTheme } from "@emotion/react";
import SettingsModalHeader from "./SettingsModalHeader";
import SettingsModalContent from "./SettingsModalContent";

export default function SettingsModal({ open, handleClose }) {
  const [content, setContent] = useState("Général");
  const theme = useTheme();

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth={false}
      aria-labelledby="settings-dialog"
      PaperProps={{
        sx: {
          bgcolor: "modal.background",
          width: "60svw",
          height: "70svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem",

          [theme.breakpoints.down("sm")]: {
            width: "75svw",
          },
          [theme.breakpoints.down("md")]: {
            height: "85svh",
          },
          [theme.breakpoints.between("sm", "lg")]: {
            width: "70svw",
          },
          [theme.breakpoints.up("md")]: {
            maxHeight: "500px",
          },
        },
      }}
    >
      <SettingsModalHeader content={content} setContent={setContent} />
      <SettingsModalContent content={content} />
    </Dialog>
  );
}

SettingsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};
