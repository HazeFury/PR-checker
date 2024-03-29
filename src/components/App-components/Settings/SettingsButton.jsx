import { useContext, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import SettingsModal from "./SettingsModal";
import UserContext from "../../../contexts/UserContext";
import useScreenSize from "../../../hooks/useScreenSize";

export default function SettingsButton({
  openSettings,
  setOpenSettings,
  userId,
}) {
  /* If user tries to close general settings with unsaved changes, this state is gonna be updated
   to open a confirmation modal thus preventing the user to lose unsaved changes without a warning */
  const [openConfirmUpdate, setOpenConfirmUpdate] = useState({
    closedSettings: false, // when user tries to close settings
    changedSection: "", // when user tries to switch settings section
  });
  /* Detects if changes have been made in general settings, 
  used to trigger openConfirmUpdate in various functions when exiting general settings without saving changes */
  const generalSettingsUpdated = useRef(false);
  // Had to use a function to change the value of current because of ESLint no-param-reassign error
  const haveGeneralSettingsBeenUpdated = (bool) => {
    generalSettingsUpdated.current = bool;
  };

  const width = useScreenSize();

  const handleClick = () => {
    setOpenSettings(true);
  };

  const handleClose = () => {
    if (generalSettingsUpdated.current) {
      // If user wants to close settings without saving changes in general settings
      setOpenConfirmUpdate({ ...openConfirmUpdate, closedSettings: true });
    } else {
      setOpenSettings(false);
    }
  };

  const { userRole } = useContext(UserContext);
  const location = useLocation();
  const pathnameFormat = /\/project\/[-\da-z]{36}/;
  const showSettings =
    pathnameFormat.test(location.pathname) && userRole === "owner";

  if (showSettings) {
    return (
      <>
        <Button
          variant="contained"
          sx={{ bgcolor: "button.main" }}
          onClick={handleClick}
          endIcon={width > 767 ? <SettingsIcon /> : null}
        >
          {width > 767 ? "Paramètres du projet" : <SettingsIcon />}
        </Button>
        <SettingsModal
          open={openSettings}
          handleClose={handleClose}
          generalSettingsUpdated={generalSettingsUpdated}
          haveGeneralSettingsBeenUpdated={haveGeneralSettingsBeenUpdated}
          openConfirmUpdate={openConfirmUpdate}
          setOpenConfirmUpdate={setOpenConfirmUpdate}
          setOpenSettings={setOpenSettings}
          userId={userId}
        />
      </>
    );
  }
}

SettingsButton.propTypes = {
  openSettings: PropTypes.bool.isRequired,
  setOpenSettings: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};
