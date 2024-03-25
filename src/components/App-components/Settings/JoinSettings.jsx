import { useEffect, useState } from "react";
import { Divider } from "@mui/material";
import { useParams } from "react-router-dom";
// eslint-disable-next-line import/no-unresolved
import { toast } from "sonner";
import ConfirmationModal from "../Modals/ConfirmationModal";
import check from "../../../assets/check.svg";
import refusedCross from "../../../assets/refusedCross.svg";
import supabase from "../../../services/client";
import styles from "./JoinSettings.module.css";

export default function JoinSettings() {
  // state to manage the data of the users
  const [pendingUsers, setPendingUsers] = useState([]);
  // states to manage the open modalConfirmation with the id of the user will be refused
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  // To keep the id of the project using params
  const getProjectId = useParams();
  const projectId = getProjectId.uuid;

  // function to get the firstname and lastname of the users who are pending true for this project selected
  async function getPendingUsers() {
    try {
      const { data: userData, error } = await supabase
        .from("project_users")
        .select("id, user_firstname, user_lastname")
        .match({
          pending: true,
          project_uuid: projectId,
        });

      if (error) {
        console.error(error);
      } else {
        setPendingUsers(userData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getPendingUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        getPendingUsers();
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
        getPendingUsers();
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
