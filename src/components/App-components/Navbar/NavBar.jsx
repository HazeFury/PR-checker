import { useState } from "react";
// eslint-disable-next-line import/no-unresolved
import { toast } from "sonner";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import styles from "./NavBar.module.css";
import Logo from "../../../assets/logo.svg";
import JoinProject from "../Project/JoinProject/JoinProject";
import CreateProject from "../Project/CreateProject/CreateProject";
import supabase from "../../../services/client";
import ProjectButtonNav from "./ProjectButtonNav";

export default function NavBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openJoinProjectModal, setOpenJoinProjectModal] = useState(false);
  const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);

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

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      } else {
        handleMenuClose();
        toast.info("À bientôt !", {
          icon: "👋",
        });
      }
    } catch (error) {
      toast.error("Une erreur s'est produite");
      console.error(error);
    }
  };

  return (
    <nav className={styles.nav_container}>
      <img className={styles.logo} src={Logo} alt="PR-checker logo" />
      <div className={styles.Tooltip}>
        <ProjectButtonNav
          openJoinProjectModal={openJoinProjectModal}
          onOpenJoinProjectModal={handleOpenJoinProjectModal}
          openCreateProjectModal={openCreateProjectModal}
          onOpenCreateProjectModal={handleOpenCreateProjectModal}
        />
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleMenuClick}
            size="large"
            sx={{ ml: 2, mx: 5 }}
            aria-controls={anchorEl ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={anchorEl ? "true" : undefined}
          >
            <PersonOutlineIcon sx={{ color: "white", scale: "1.8" }} />
          </IconButton>
        </Tooltip>
      </div>

      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
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
        <MenuItem onClick={handleMenuClose}>
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
      <JoinProject
        openModalJoin={openJoinProjectModal}
        onCloseModalJoin={handleCloseJoinProjectModal}
      />
      <CreateProject
        openModalCreate={openCreateProjectModal}
        onCloseModalCreate={handleCloseCreateProjectModal}
      />
    </nav>
  );
}
