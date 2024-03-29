import { useEffect, useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
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

export default function NavBar({ userId }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openNotificationBox, setOpenNotificationBox] = useState(false);
  const [openJoinProjectModal, setOpenJoinProjectModal] = useState(false);
  const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const location = useLocation();

  /* Used to close settings modal when leaving project without closing it manually */
  useEffect(() => {
    setOpenSettings(false);
  }, [location]);

  const theme = useTheme();

  // to open the notification list
  const handleOpenNotification = () => {
    setOpenNotificationBox(true);
  };

  // to close the notification list
  const handleCloseNotification = () => {
    setOpenNotificationBox(false);
  };

  // to open the join project modal
  const handleOpenJoinProjectModal = () => {
    setOpenJoinProjectModal(true);
  };
  // to close the join project modal
  const handleCloseJoinProjectModal = () => {
    setOpenJoinProjectModal(false);
  };
  // to open the create project modal
  const handleOpenCreateProjectModal = () => {
    setOpenCreateProjectModal(true);
  };
  // to open the create project modal
  const handleCloseCreateProjectModal = () => {
    setOpenCreateProjectModal(false);
  };
  // to open the user menu
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  // to close the user menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Function to logout
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
      <NavLink to="/">
        <img className={styles.logo} src={Logo} alt="PR-checker logo" />
      </NavLink>
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
        />

        <SettingsButton
          openSettings={openSettings}
          setOpenSettings={setOpenSettings}
          userId={userId}
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
};

NavBar.defaultProps = {
  userId: "",
};
