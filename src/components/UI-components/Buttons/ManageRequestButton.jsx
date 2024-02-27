import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Button, Menu, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

export default function ManageRequestButton({
  textItem1,
  textItem2,
  buttonText,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        variant="contained"
        sx={{ backgroundColor: "#3883BA" }}
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
            backgroundColor: "#3E3E3E",
            color: "#FFFFFF",
            minWidth: "9.8rem",
          },
        }}
      >
        <MenuItem
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: "12px",
            borderBottom: "1px solid white",
            display: "flex",
            justifyContent: "center",
            paddingBottom: "10px",
            marginRight: "10px",
            marginLeft: "10px",
            "&:hover": {
              backgroundColor: "#3883BA",
              marginRight: "0px",
              marginLeft: "0px",
            },
          }}
          onClick={handleClose}
        >
          {textItem1}
        </MenuItem>
        <MenuItem
          sx={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
          onClick={handleClose}
        >
          <Button
            sx={{
              fontFamily: "Montserrat, sans-serif",
              backgroundColor: "#BA3838",
              color: "#FFFFFF",
              fontSize: "12px",
              paddingLeft: "20px",
              paddingRight: "20px",

              "&:hover": {
                backgroundColor: "#8c2222",
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
};
