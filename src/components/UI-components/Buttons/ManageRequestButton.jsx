import { KeyboardArrowDown, KeyboardArrowUp, Loop } from "@mui/icons-material";
import { Button, Divider, Menu, MenuItem } from "@mui/material";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { useOutletContext } from "react-router-dom";
// eslint-disable-next-line import/no-unresolved
import { toast } from "sonner";
import supabase from "../../../services/client";
import refreshContext from "../../../contexts/RefreshContext";
import useScreenSize from "../../../hooks/useScreenSize";
import createAndSendNotification from "../../../services/utilities/createAndSendNotification";

export default function ManageRequestButton({
  request,
  statusNames,
  userRole,
  handleOpenModalAboutRequest,
  handleOpenConfirmationModal,
  statusColor,
}) {
  const screenSize = useScreenSize();
  const userId = useOutletContext();
  const { refreshData, setRefreshData } = useContext(refreshContext);

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
  const setItemsToRender = () => {
    if (userRole === "owner") {
      if (request.status === 5 || request.status === 6) return []; // When status is validated or rejected, no options should be available
      return statusNames.filter(
        (el) =>
          el.name !== statusNames[request.status - 1].name &&
          el.name !== "Correctifs faits"
      ); // the same status and "Correctifs faits" should never be available options for owners
    }

    const contributorOptions = [{ name: "Modifier", value: 0 }];
    if (request.status === 3) contributorOptions.push(statusNames[3]);
    return contributorOptions;
  };
  const itemsToRender = setItemsToRender();

  /* --- Function to update the status in the database --- */
  const handleStatusUpdate = async (e) => {
    try {
      const newStatus = e.target.value;
      const { error } = await supabase
        .from("pr_request")
        .update({ status: newStatus })
        .eq("id", request.id);

      const requestId = request.id;

      if (error) throw error;
      else {
        if (newStatus === 5 || newStatus === 6) {
          // Si le statut précédent n'était pas 5 ou 6 et le nouveau statut est 5 ou 6, cela créer la notification
          await createAndSendNotification(newStatus, requestId);
        }
        toast.success("Le statut a bien été mis à jour");
      }
    } catch (error) {
      toast.error("Une erreur s'est produite, veuillez réessayer plus tard");
      console.error(error);
    }
    setRefreshData(!refreshData);
  };

  return (
    <div>
      <Button
        id="admin-button"
        disabled={
          // disabled when user is contributor of project and didnt create pr or depending on status
          userRole === "contributor" &&
          (request.status === 2 ||
            request.status === 5 ||
            request.status === 6 ||
            userId[0] !== request.user_uuid)
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
        {screenSize > 400 ? "Administrer" : <Loop />}
      </Button>
      <Menu
        id="admin-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "admin-options",
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
        {itemsToRender.map((item) => {
          return (
            <MenuItem
              key={item.value}
              value={item.value}
              sx={{
                fontSize: "0.9em",
                display: "flex",
                flexDirection: "row-reverse",
                paddingBlock: "0.8rem",
                paddingLeft: "2rem",

                "&:hover": {
                  bgcolor: `var(--${statusColor(item.value).slice(1, statusColor(item.value).indexOf("_", 1))})`,
                  color: "text.primary",
                },
              }}
              onClick={(e) => {
                handleClose();
                if (item.name === "Modifier") handleOpenModalAboutRequest();
                else handleStatusUpdate(e);
              }}
            >
              {item.name}
            </MenuItem>
          );
        })}
        {itemsToRender.length > 0 &&
        (userRole === "owner" ||
          (userRole === "contributor" && request.status === 1)) ? (
          <Divider
            sx={{
              bgcolor: "text.secondary",
              width: "80%",
              marginInline: "auto",
            }}
          />
        ) : null}
        {userRole === "owner" || // User can delete only when he's owner, or contributor on a newly created PR
        (userRole === "contributor" && request.status === 1) ? (
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
  request: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    github: PropTypes.string.isRequired,
    trello: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    user_uuid: PropTypes.string.isRequired,
  }).isRequired,
  statusNames: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
    }).isRequired
  ).isRequired,
  userRole: PropTypes.string.isRequired,
  handleOpenModalAboutRequest: PropTypes.func.isRequired,
  handleOpenConfirmationModal: PropTypes.func.isRequired,
  statusColor: PropTypes.func.isRequired,
};
