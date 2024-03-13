import { useTheme } from "@emotion/react";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Button, Menu, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

export default function ManageRequestButton({
  textItem1,
  textItem2,
  buttonText,
  handleOpenModalAboutRequest,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const theme = useTheme();
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        variant="contained"
        sx={{
          backgroundColor: theme.palette.button.main,
          textTransform: "none",
        }}
        size="small"
        endIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      >
        {buttonText}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.modal.background,
            color: theme.palette.text.secondary,
            minWidth: "9.8rem",
          },
        }}
      >
        <MenuItem
          sx={{
            fontFamily: theme.typography.fontFamily,
            fontSize: "12px",
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",

            "&:hover": {
              backgroundColor: theme.palette.button.main,
              marginRight: "0px",
              marginLeft: "0px",
            },
          }}
          onClick={() => {
            handleClose();
            handleOpenModalAboutRequest();
          }}
        >
          {textItem1}
        </MenuItem>
        <MenuItem
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "15px",
            margin: "0 5%",
            borderTop: "2px solid #ABABAB",
            boxSizing: "border-box",
          }}
          onClick={handleClose}
        >
          <Button
            sx={{
              fontFamily: theme.typography.fontFamily,
              backgroundColor: theme.palette.button.secondary,
              color: theme.palette.text.secondary,
              fontSize: "12px",
              paddingLeft: "30px",
              paddingRight: "30px",

              "&:hover": {
                backgroundColor: theme.palette.button.hover,
              },
            }}
          >
            {textItem2}
          </Button>
        </MenuItem>
      </Menu>
    </div>
  );
}
ManageRequestButton.propTypes = {
  textItem1: PropTypes.string.isRequired,
  textItem2: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  handleOpenModalAboutRequest: PropTypes.func.isRequired,
};
