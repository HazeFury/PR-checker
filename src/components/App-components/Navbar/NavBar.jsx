import { useState } from "react";
import PropTypes from "prop-types";
// eslint-disable-next-line import/no-unresolved
import { toast } from "sonner";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { useTheme } from "@emotion/react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Settings, Logout } from "@mui/icons-material";
import styles from "./NavBar.module.css";
import Logo from "../../../assets/logo.svg";
import JoinProject from "../Project/JoinProject/JoinProject";
import CreateProject from "../Project/CreateProject/CreateProject";
import supabase from "../../../services/client";
import ProjectButtonNav from "./ProjectButtonNav";
import NotificationButtonNav from "./NotificationButtonNav";
import SettingsButton from "../Settings/SettingsButton";

export default function NavBar({ userId, refreshData }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openNotificationBox, setOpenNotificationBox] = useState(false);
  const [openJoinProjectModal, setOpenJoinProjectModal] = useState(false);
  const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);
  const theme = useTheme();

  const handleOpenNotification = () => {
    setOpenNotificationBox(true);
  };

  const handleCloseNotification = () => {
    setOpenNotificationBox(false);
  };

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
      <a href="/">
        <img className={styles.logo} src={Logo} alt="PR-checker logo" />
      </a>
      <div className={styles.Tooltip}>
        <ProjectButtonNav
          openJoinProjectModal={openJoinProjectModal}
          onOpenJoinProjectModal={handleOpenJoinProjectModal}
          openCreateProjectModal={openCreateProjectModal}
          onOpenCreateProjectModal={handleOpenCreateProjectModal}
        />
        <NotificationButtonNav
          handleOpenNotification={handleOpenNotification}
          handleCloseNotification={handleCloseNotification}
          openNotificationBox={openNotificationBox}
          userId={userId}
          refreshData={refreshData}
        />
        <SettingsButton />

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
        <MenuItem
          onClick={handleMenuClose}
          sx={{
            color: theme.palette.text.primary,
          }}
        >
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

NavBar.propTypes = {
  userId: PropTypes.string,
  refreshData: PropTypes.func.isRequired,
};

NavBar.defaultProps = {
  userId: "",
};
