import { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
} from "@mui/material";
import { Close, Menu as MenuIcon } from "@mui/icons-material";
import useScreenSize from "../../../hooks/useScreenSize";

const sectionNames = ["Général", "Membres", "Demandes"];

export default function SettingsModalHeader({
  content,
  setContent,
  generalSettingsUpdated,
  openConfirmUpdate,
  setOpenConfirmUpdate,
}) {
  const width = useScreenSize();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (e) => {
    if (generalSettingsUpdated.current) {
      // if user tries to change section without saving changes in general settings
      setOpenConfirmUpdate({
        ...openConfirmUpdate,
        changedSection: e.target.innerText,
      });
    } else {
      setContent(e.target.innerText);
      if (width <= 767) setAnchorEl(null);
    }
  };

  return (
    <header
      style={{
        width: "90%",
      }}
    >
      <nav>
        {width > 767 ? (
          <ul style={{ display: "flex", justifyContent: "space-around" }}>
            {sectionNames.map((name) => {
              return (
                <li key={name}>
                  <Button
                    onClick={handleClick}
                    sx={
                      content === name
                        ? { color: "text.secondary" }
                        : { color: "button.main", textTransform: "none" }
                    }
                  >
                    {name}
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : (
          <>
            <IconButton
              id="menu-button"
              aria-controls={open ? "burger-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClickMenu}
            >
              {open ? (
                <Close sx={{ color: "text.secondary" }} />
              ) : (
                <MenuIcon sx={{ color: "text.secondary" }} />
              )}
            </IconButton>
            <Menu
              id="burger-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "option-button",
              }}
              slotProps={{
                paper: {
                  sx: {
                    bgcolor: "modal.background",
                  },
                },
              }}
            >
              <MenuList>
                {sectionNames.map((name) => {
                  return (
                    <MenuItem key={name}>
                      <Button
                        onClick={handleClick}
                        sx={
                          content === name
                            ? { color: "text.secondary" }
                            : { color: "button.main", textTransform: "none" }
                        }
                      >
                        {name}
                      </Button>
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Menu>
          </>
        )}
        <Divider sx={{ bgcolor: "#e8e8e8", height: "1px" }} />
      </nav>
    </header>
  );
}

SettingsModalHeader.propTypes = {
  content: PropTypes.string.isRequired,
  setContent: PropTypes.func.isRequired,
  generalSettingsUpdated: PropTypes.objectOf(PropTypes.bool).isRequired,
  openConfirmUpdate: PropTypes.shape({
    closedSettings: PropTypes.bool.isRequired,
    changedSection: PropTypes.string.isRequired,
  }).isRequired,
  setOpenConfirmUpdate: PropTypes.func.isRequired,
};
