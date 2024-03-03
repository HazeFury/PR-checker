import { useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Button, Tooltip, IconButton } from "@mui/material";
import useScreeSize from "../../../hooks/useScreenSize";
import styles from "./ProjectButtonNav.module.css";

export default function ProjectButtonNav({
  onOpenJoinProjectModal,

  onOpenCreateProjectModal,
}) {
  const width = useScreeSize();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClickButtonSection = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseButtonSection = () => {
    setAnchorEl(null);
  };
  const location = useLocation();

  const isProjectPage = location.pathname === "/";
  const renderExtraButton = () => {
    if (isProjectPage) {
      if (width > 1064) {
        return (
          <>
            <Button
              onClick={onOpenJoinProjectModal}
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
              onClick={onOpenCreateProjectModal}
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
          </>
        );
      }
      return (
        <>
          <div className={styles.containerTooltip}>
            {" "}
            <Tooltip title="Button section">
              <IconButton
                onClick={handleClickButtonSection}
                size="large"
                sx={{ ml: 2, mx: 5 }}
                aria-controls={open ? "button-section" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <ControlPointIcon sx={{ color: "white", scale: "1.8" }} />
              </IconButton>
            </Tooltip>
          </div>

          <Menu
            anchorEl={anchorEl}
            id="button-section"
            open={open}
            onClose={handleCloseButtonSection}
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
            <MenuItem onClick={onOpenJoinProjectModal}>
              Rejoindre un projet
            </MenuItem>
            <MenuItem onClick={onOpenCreateProjectModal}>
              Créer un projet
            </MenuItem>
          </Menu>
        </>
      );
    }
    return null;
  };

  return <div>{renderExtraButton()}</div>;
}

ProjectButtonNav.propTypes = {
  onOpenJoinProjectModal: PropTypes.func.isRequired,
  onOpenCreateProjectModal: PropTypes.func.isRequired,
};
