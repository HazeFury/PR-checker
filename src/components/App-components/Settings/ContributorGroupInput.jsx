import { useState } from "react";
import PropTypes from "prop-types";
// eslint-disable-next-line import/no-unresolved
import { toast } from "sonner";
import styles from "./ContributorSettings.module.css";
import supabase from "../../../services/client";

export default function ContributorGroupInput({
  user,
  contributors,
  setContributors,
}) {
  const [newGroup, setNewGroup] = useState(user.group);
  const { id: userId, group: userGroup } = user;
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
    <div className={styles.group}>
      <label htmlFor={`group${userId}`}>Groupe</label>
      <input
        type="text"
        id={`group${userId}`}
        value={newGroup}
        onChange={handleGroupChange}
        onBlur={handleGroupBlur}
        className={styles.input}
      />
    </div>
  );
}

ContributorGroupInput.propTypes = {
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
