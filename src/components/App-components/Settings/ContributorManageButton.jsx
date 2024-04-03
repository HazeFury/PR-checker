import { useState } from "react";
import {
  Group,
  KeyboardArrowDown,
  KeyboardDoubleArrowUp,
  ManageAccounts,
  PersonRemove,
} from "@mui/icons-material";
import { Button, Menu, MenuItem } from "@mui/material";
// eslint-disable-next-line import/no-unresolved
import { toast } from "sonner";
import PropTypes from "prop-types";
import supabase from "../../../services/client";
import useScreenSize from "../../../hooks/useScreenSize";
import ConfirmationModal from "../Modals/ConfirmationModal";
import ContributorGroupModal from "./ContributorGroupModal";

export default function ContributorManageButton({
  user,
  contributors,
  setContributors,
}) {
  /* --- Functions and states for MUI Menu --- */
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  /* ----------------------------------------- */
  const [openGroupChange, setOpenGroupChange] = useState(false);
  const handleGroupChangeClick = () => {
    setOpenGroupChange(true);
  };

  const handleGroupChangeClose = () => {
    setOpenGroupChange(false);
  };

  const [hover, setHover] = useState({
    group: false,
    promote: false,
  });
  const [confirmRemove, setConfirmRemove] = useState(false);
  const { id: userId, role: userRole, user_firstname: userFirstName } = user;
  const targetUser = user;
  const screenSize = useScreenSize();

  const fetchUserNewRole = async (targetId) => {
    // Only fetch the newly updated role of the target user, to avoid using getContributors() for so little change
    try {
      const { data, error } = await supabase
        .from("project_users")
        .select("role")
        .eq("id", targetId)
        .single();

      if (error) throw error;
      else {
        const targetUserIndex = contributors.indexOf(targetUser);
        targetUser.role = data.role;
        setContributors(contributors.toSpliced(targetUserIndex, 1, targetUser));
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur s'est produite, veuillez réessayer plus tard");
    }
  };

  const updateUserRole = async (targetId) => {
    try {
      const { error } = await supabase
        .from("project_users")
        .update({ role: userRole === "owner" ? "contributor" : "owner" })
        .eq("id", targetId);

      fetchUserNewRole(targetId);
      if (error) throw error;
      else
        toast.success(
          userRole !== "owner"
            ? `${userFirstName} est maintenant admin du projet !`
            : `${userFirstName} a été rétrogradé au rang de contributeur`
        );
    } catch (error) {
      console.error(error);
      toast.error("Une erreur s'est produite, veuillez rééssayer plus tard");
    }
  };

  const removeUser = async (targetId) => {
    try {
      const { error } = await supabase
        .from("project_users")
        .delete()
        .eq("id", targetId);

      if (error) throw error;
      else {
        toast.success(`${userFirstName} a bien été retiré du projet`);
        setContributors([...contributors.filter((el) => el !== targetUser)]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur s'est produite, veuillez rééssayer plus tard");
    }
  };

  const handleMouseEnter = (e) => {
    setHover({ ...hover, [e.target.id]: true });
  };

  const handleMouseLeave = (e) => {
    setHover({ ...hover, [e.target.id]: false });
  };

  const handleClickRole = () => {
    updateUserRole(userId);
  };

  const handleClickRemove = () => {
    setAnchorEl(null);
    setConfirmRemove(true);
  };

  const handleCancelRemove = () => {
    setConfirmRemove(false);
  };

  const handleConfirmRemove = () => {
    removeUser(userId);
    setConfirmRemove(false);
  };

  return (
    <>
      <Button
        size="small"
        variant="contained"
        onClick={handleClick}
        endIcon={
          <KeyboardArrowDown
            sx={{
              transform: open ? "rotate(-180deg)" : "none",
              transition: "transform 0.3s ease",
            }}
          />
        }
        sx={{ bgcolor: "button.main", textTransform: "none" }}
      >
        {screenSize > 767 ? "Administrer" : <ManageAccounts />}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#3E3E3E",
              color: "#FFFFFF",
              ".MuiMenu-list": {
                display: "flex",
                flexDirection: "column",
                gap: "0.2rem",
              },
            },
          },
        }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          id="group"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleGroupChangeClick}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            "&:hover": { bgcolor: "button.main" },
          }}
        >
          <p style={{ fontSize: "0.8em", paddingRight: "1rem" }}>Groupe</p>
          <Group sx={{ color: hover.group ? "var(--light)" : "button.main" }} />
        </MenuItem>
        <MenuItem
          id="promote"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClickRole}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            "&:hover": { bgcolor: "button.main" },
          }}
        >
          <p style={{ fontSize: "0.8em", paddingRight: "1rem" }}>
            {userRole === "owner" ? "Rétrograder" : "Promouvoir"}
          </p>
          <KeyboardDoubleArrowUp
            sx={
              userRole === "owner"
                ? {
                    color: hover.promote ? "var(--light)" : "var(--error)",
                    transform: "rotate(180deg)",
                    transition: "transform 0.3s ease",
                  }
                : {
                    color: hover.promote ? "var(--light)" : "button.main",
                    transition: "transform 0.3s ease",
                  }
            }
          />
        </MenuItem>

        <MenuItem
          onClick={handleClickRemove}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            "&:hover": { bgcolor: "button.main" },
          }}
        >
          <p style={{ fontSize: "0.8em", paddingRight: "1rem" }}>Retirer</p>
          <PersonRemove sx={{ color: "var(--error)" }} />
        </MenuItem>
      </Menu>

      <ContributorGroupModal
        user={user}
        contributors={contributors}
        setContributors={setContributors}
        openGroupChange={openGroupChange}
        handleGroupChangeClose={handleGroupChangeClose}
      />

      {confirmRemove && (
        <ConfirmationModal
          handleLeftButtonClick={handleCancelRemove}
          handleRightButtonClick={handleConfirmRemove}
          title={`Voulez-vous vraiment retirer ${userFirstName} du projet ?`}
          textButtonLeft="Annuler"
          textButtonRight="Retirer"
        />
      )}
    </>
  );
}

ContributorManageButton.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    group: PropTypes.number.isRequired,
    role: PropTypes.string.isRequired,
    user_firstname: PropTypes.string.isRequired,
    user_lastname: PropTypes.string.isRequired,
  }).isRequired,
  contributors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      group: PropTypes.number.isRequired,
      role: PropTypes.string.isRequired,
      user_firstname: PropTypes.string.isRequired,
      user_lastname: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  setContributors: PropTypes.func.isRequired,
};
