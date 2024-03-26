import { useState } from "react";
import PropTypes from "prop-types";

import { Divider } from "@mui/material";
import { useParams } from "react-router-dom";
// eslint-disable-next-line import/no-unresolved
import { toast } from "sonner";
import ConfirmationModal from "../Modals/ConfirmationModal";
import check from "../../../assets/check.svg";
import refusedCross from "../../../assets/refusedCross.svg";
import supabase from "../../../services/client";
import styles from "./JoinSettings.module.css";

export default function JoinSettings({ pendingUsers }) {
  // states to manage the open modalConfirmation with the id of the user will be refused
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  // To keep the id of the project using params
  const getProjectId = useParams();
  const projectId = getProjectId.uuid;
  // function to edit the pending (true to false) when the owner valid to add this user in the project
  async function handleCheck(userId) {
    try {
      const { error } = await supabase
        .from("project_users")
        .update({ pending: false })
        .match({ id: userId, project_uuid: projectId });

      if (error) {
        toast.error("L'ajout de l'utilisateur dans le projet a échoué");
      } else {
        toast.success("L'utilisateur a bien été ajouté au projet");
      }
    } catch (error) {
      console.error(error);
    }
  }
  // function to delete the user in project_users table, when the owner dosen't want to add the user in the project
  async function handleRefused(userId) {
    try {
      const { error } = await supabase
        .from("project_users")
        .delete()
        .match({ id: userId, project_uuid: projectId });

      if (error) {
        toast.error("Le refus de l'utilisateur dans le projet a échoué");
      } else {
        toast.info("La demande d'ajout a bien été rejetée");
      }
    } catch (error) {
      console.error(error);
    }
  }
  // function to open modal with the userId of the user will be refused
  const handleUserRefused = (userId) => {
    setUserIdToDelete(userId);
    setShowConfirmationModal(true);
  };
  // function to close modal if owner dosen't want finally refused the user
  const handleCloseModal = () => {
    setShowConfirmationModal(false);
    setUserIdToDelete(null);
  };

  return (
    <div>
      {pendingUsers.map((user) => (
        <div key={user.id}>
          <div className={styles.pendingUsersRow}>
            <div className={styles.userName}>
              <p>{user.user_firstname}</p> <p>{user.user_lastname}</p>
            </div>
            <div className={styles.buttonsBlock} key={user.id}>
              <button onClick={() => handleUserRefused(user.id)} type="button">
                {" "}
                <img src={refusedCross} alt="refusedCross" />
              </button>
              <button onClick={() => handleCheck(user.id)} type="button">
                <img src={check} alt="check" />
              </button>
            </div>
          </div>
          <Divider key={user.id} sx={{ bgcolor: "#e8e8e8", height: "1px" }} />
        </div>
      ))}
      {showConfirmationModal && (
        <ConfirmationModal
          title="Êtes-vous sûr de vouloir refuser cet utilisateur ?"
          textButtonLeft="Oui"
          textButtonRight="Annuler"
          handleLeftButtonClick={() => {
            handleRefused(userIdToDelete);
            handleCloseModal();
          }}
          handleRightButtonClick={handleCloseModal}
        />
      )}
    </div>
  );
}

JoinSettings.propTypes = {
  pendingUsers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user_firstname: PropTypes.string.isRequired,
      user_lastname: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};
