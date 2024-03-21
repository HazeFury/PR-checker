import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import SettingsModal from "./SettingsModal";
import UserContext from "../../../contexts/UserContext";
import useScreenSize from "../../../hooks/useScreenSize";

export default function Settings() {
  const width = useScreenSize();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
        <SettingsModal open={open} handleClose={handleClose} />
      </>
    );
  }
}
