import { useState } from "react";
import PropTypes from "prop-types";
import { Dialog, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
// eslint-disable-next-line import/no-unresolved
import { toast } from "sonner";
import styles from "./ContributorSettings.module.css";
import supabase from "../../../services/client";

export default function ContributorGroupModal({
  user,
  contributors,
  setContributors,
  openGroupChange,
  handleGroupChangeClose,
}) {
  const [newGroup, setNewGroup] = useState(user.group);
  const { id: userId, group: userGroup, user_firstname: userFirstName } = user;
  const targetUser = user;

  const updateUserGroup = async (targetId) => {
    // Only fetch the newly updated group of the target user, to avoid using getContributors() for so little change
    try {
      const { data, error } = await supabase
        .from("project_users")
        .select("group")
        .match({ id: targetId })
        .single();

      if (error) throw error;
      else {
        const targetUserIndex = contributors.indexOf(targetUser);
        targetUser.group = data.group;
        setContributors(contributors.toSpliced(targetUserIndex, 1, targetUser));
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur s'est produite, veuillez réessayer plus tard");
    }
  };

  const saveGroupChange = async (targetId) => {
    try {
      const { error } = await supabase
        .from("project_users")
        .update({ group: +newGroup })
        .match({ id: targetId });

      updateUserGroup(targetId);
      if (error) {
        throw error;
      } else {
        toast.success(
          `${targetUser.user_firstname} fait maintenant partie du groupe ${newGroup}`
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur s'est produite, veuillez réessayer plus tard");
    }
  };

  const handleGroupChange = (e) => {
    // Group value can only change if it's 0 to 3 digits long
    if (/^[\d]{0,3}$/.test(e.target.value)) {
      setNewGroup(e.target.value);
    }
  };

  const handleGroupBlur = (e) => {
    // Group value is updated only if is different from original
    if (+e.target.value !== userGroup) {
      if (!e.target.value) {
        // Reset the group value if input is empty
        setNewGroup(userGroup);
      } else {
        saveGroupChange(userId);
      }
    }
  };

  return (
    <Dialog
      open={openGroupChange}
      onClose={handleGroupChangeClose}
      PaperProps={{
        sx: {
          maxWidth: ["50svw", "40svw"],
          bgcolor: "modal.background",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        },
      }}
    >
      <IconButton
        sx={{
          position: "absolute",
          top: "0.2rem",
          right: "0.2rem",
          bgcolor: "button.secondary",
          width: "2rem",
          height: "2rem",
          borderRadius: "0px 5px 0px 10px",
          "&:hover": { bgcolor: "button.hover" },
        }}
        onClick={handleGroupChangeClose}
        aria-label="close"
      >
        <Close style={{ color: "white" }} />
      </IconButton>
      <h1
        style={{
          fontSize: "1em",
          textAlign: "center",
          marginBlock: "1.5rem",
          width: "80%",
        }}
      >{`Entrez le numéro du groupe dont ${userFirstName} doit faire partie :`}</h1>
      <div style={{ marginBottom: "1.5rem" }}>
        <label htmlFor={`group${userId}`}>Groupe </label>
        <input
          type="text"
          id={`group${userId}`}
          className={styles.input}
          value={newGroup}
          onChange={handleGroupChange}
          onBlur={handleGroupBlur}
        />
      </div>
    </Dialog>
  );
}

ContributorGroupModal.propTypes = {
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
  openGroupChange: PropTypes.bool.isRequired,
  handleGroupChangeClose: PropTypes.func.isRequired,
};
