import { useEffect, useState } from "react";
import { Divider } from "@mui/material";
import { useParams } from "react-router-dom";

import check from "../../../assets/check.svg";
import refusedCross from "../../../assets/refusedCross.svg";

import supabase from "../../../services/client";
import styles from "./JoinSettings.module.css";

export default function JoinSettings() {
  // state to manage the data of the users
  const [pendingUsers, setPendingUsers] = useState([]);

  // To keep the id of the project using params
  const getProjectId = useParams();
  const projectId = getProjectId.uuid;

  // function to get the firstname and lastname of the users who are pending true for this project selected
  async function getPendingUsers() {
    try {
      const { data: userData, error } = await supabase
        .from("project_users")
        .select("user_firstname, user_lastname")
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

  return (
    <div>
      {pendingUsers.map((user) => (
        <div className={styles.block} key={user.id}>
          <div className={styles.pendingUsersRow}>
            {user.user_firstname}
            {user.user_lastname}
            <div className={styles.buttonsBlock} key={user.id}>
              <button type="button">
                {" "}
                <img src={refusedCross} alt="refusedCross" />
              </button>
              <button type="button">
                <img src={check} alt="check" />
              </button>
            </div>
          </div>
          <Divider sx={{ bgcolor: "#e8e8e8", height: "1px" }} />
        </div>
      ))}
    </div>
  );
}
