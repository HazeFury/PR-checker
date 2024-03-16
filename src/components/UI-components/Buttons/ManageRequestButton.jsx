import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { Button, Divider, Menu, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

export default function ManageRequestButton({
  PRStatus,
  statusNames,
  userRole,
  buttonText,
  handleOpenModalAboutRequest,
  handleOpenConfirmationModal,
}) {
  /* --- State and functions used for MUI Menu component --- */
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  /* --- Function to modify the list of items to render --- */
  const itemsToRender = () => {
    if (userRole === "owner") {
      if (PRStatus === 5 || PRStatus === 6) return []; // When status is validated or rejected, no options should be available
      return statusNames.filter(
        (el) => el !== statusNames[PRStatus - 1] && el !== "Correctifs faits"
      ); // the same status and "Correctifs faits" should never be available options for owners
    }

    const contributorOptions = ["Modifier"];
    if (PRStatus === 3) contributorOptions.push(statusNames[3]);
    return contributorOptions;
  };

  /* --- Function to update the status in the database --- */
  const handleStatusUpdate = (e) => {
    console.info(
      `Je dois changer le statut '${statusNames.filter((el) => el === statusNames[PRStatus - 1])}' en '${e.target.innerText}'`
    );
  };

  return (
    <div>
      <Button
        id="admin-button"
        disabled={
          userRole === "contributor" &&
          (PRStatus === 2 || PRStatus === 5 || PRStatus === 6)
        }
        aria-controls={open ? "admin-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        variant="contained"
        sx={{
          bgcolor: "button.main",
          textTransform: "none",
        }}
        size="small"
        endIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      >
        {buttonText}
      </Button>
      <Menu
        id="admin-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "admin-buttons",
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth: "7.7rem",
              bgcolor: "modal.background",
              color: "text.secondary",
            },
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {itemsToRender().map((item) => {
          return (
            <MenuItem
              key={item}
              sx={{
                fontSize: "0.9em",
                display: "flex",
                flexDirection: "row-reverse",
                paddingBlock: "0.8rem",

                "&:hover": {
                  bgcolor: "button.main",
                },
              }}
              onClick={(e) => {
                handleClose();
                if (item === "Modifier") handleOpenModalAboutRequest();
                else handleStatusUpdate(e);
              }}
            >
              {item}
            </MenuItem>
          );
        })}
        {itemsToRender().length > 0 &&
        (userRole === "owner" ||
          (userRole === "contributor" && PRStatus === 1)) ? (
          <Divider
            sx={{
              bgcolor: "text.secondary",
              width: "80%",
              marginInline: "auto",
            }}
          />
        ) : null}
        {userRole === "owner" || // User can delete only when he's owner, or contributor on a newly created PR
        (userRole === "contributor" && PRStatus === 1) ? (
          <MenuItem>
            <Button
              variant="contained"
              sx={{
                width: "100%",
                bgcolor: "button.secondary",
                color: "text.secondary",
                paddingInline: "1.5rem",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "button.hover",
                },
              }}
              onClick={() => {
                handleClose();
                handleOpenConfirmationModal();
              }}
            >
              Supprimer
            </Button>
          </MenuItem>
        ) : null}
      </Menu>
    </div>
  );
}
ManageRequestButton.propTypes = {
  PRStatus: PropTypes.number.isRequired,
  statusNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  userRole: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  handleOpenModalAboutRequest: PropTypes.func.isRequired,
  handleOpenConfirmationModal: PropTypes.func.isRequired,
};
