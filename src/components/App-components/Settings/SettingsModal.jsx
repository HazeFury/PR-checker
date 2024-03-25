import { useState } from "react";
import PropTypes from "prop-types";
import { Dialog, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import SettingsModalHeader from "./SettingsModalHeader";
import SettingsModalContent from "./SettingsModalContent";

export default function SettingsModal({
  open,
  handleClose,
  generalSettingsUpdated,
  haveGeneralSettingsBeenUpdated,
  openConfirmUpdate,
  setOpenConfirmUpdate,
  setOpenSettings,
}) {
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
      <IconButton
        sx={{
          position: "absolute",
          top: "0.2rem",
          right: "0.2rem",
          bgcolor: "button.secondary",
          width: "2.3rem",
          height: "2.5rem",
          borderRadius: "0px 5px 0px 10px",
          "&:hover": { bgcolor: "button.hover" },
        }}
        onClick={handleClose}
        aria-label="close"
      >
        <Close style={{ color: "white" }} />
      </IconButton>
      <SettingsModalHeader
        content={content}
        setContent={setContent}
        generalSettingsUpdated={generalSettingsUpdated}
        openConfirmUpdate={openConfirmUpdate}
        setOpenConfirmUpdate={setOpenConfirmUpdate}
      />
      <SettingsModalContent
        content={content}
        setContent={setContent}
        haveGeneralSettingsBeenUpdated={haveGeneralSettingsBeenUpdated}
        openConfirmUpdate={openConfirmUpdate}
        setOpenConfirmUpdate={setOpenConfirmUpdate}
        setOpenSettings={setOpenSettings}
      />
    </Dialog>
  );
}

SettingsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  generalSettingsUpdated: PropTypes.objectOf(PropTypes.bool).isRequired,
  haveGeneralSettingsBeenUpdated: PropTypes.func.isRequired,
  openConfirmUpdate: PropTypes.shape({
    closedSettings: PropTypes.bool.isRequired,
    changedSection: PropTypes.string.isRequired,
  }).isRequired,
  setOpenConfirmUpdate: PropTypes.func.isRequired,
  setOpenSettings: PropTypes.func.isRequired,
};
