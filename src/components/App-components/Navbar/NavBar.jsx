import { useState } from "react";

import { useLocation } from "react-router-dom";
// eslint-disable-next-line import/no-unresolved
import { toast } from "sonner";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import styles from "./NavBar.module.css";
import JoinProject from "../Project/JoinProject/JoinProject";
import CreateProject from "../Project/CreateProject/CreateProject";
import Logo from "../../../assets/logo.svg";
import supabase from "../../../services/client";

export default function NavBar() {
  const location = useLocation();

  const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);
  const [openJoinProjectModal, setOpenJoinProjectModal] = useState(false);

  const handleOpenJoinProjectModal = () => {
    setOpenJoinProjectModal(true);
  };

  const handleCloseJoinProjectModal = () => {
    setOpenJoinProjectModal(false);
  };

  const handleOpenCreateProjectModal = () => {
    setOpenCreateProjectModal(true);
  };

  const handleCloseCreateProjectModal = () => {
    setOpenCreateProjectModal(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      else {
        setAnchorEl(null);
        toast.info("À bientôt !", {
          icon: "👋",
        });
      }
    } catch (error) {
      toast.error("Une erreur s'est produite");
      console.error(error);
    }
  };

  const isProjectPage = location.pathname === "/";

  const renderExtraButton = () => {
    if (isProjectPage) {
      return (
        <>
          <Button
            onClick={handleOpenJoinProjectModal}
            variant="contained"
            style={{
              backgroundColor: "#3883BA",
              color: "white",
              marginRight: "1rem",
              minWidth: "17rem",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontFamily: "Montserrat",
            }}
          >
            REJOINDRE UN PROJET
          </Button>
          <Button
            onClick={handleOpenCreateProjectModal}
            variant="contained"
            style={{
              backgroundColor: "#3883BA",
              color: "white",
              minWidth: "17rem",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontFamily: "Montserrat",
            }}
          >
            Créer un projet
          </Button>
          <JoinProject
            open={openJoinProjectModal}
            onClose={handleCloseJoinProjectModal}
          />
          <CreateProject
            open={openCreateProjectModal}
            onClose={handleCloseCreateProjectModal}
          />
        </>
      );
    }
    return null;
  };

  return (
    <nav className={styles.nav_container}>
      <img className={styles.logo} src={Logo} alt="PR-checker logo" />

      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        {renderExtraButton()}

        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="large"
            sx={{ ml: 2, mx: 5 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <PersonOutlineIcon sx={{ color: "white", scale: "1.8" }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </nav>
  );
}
