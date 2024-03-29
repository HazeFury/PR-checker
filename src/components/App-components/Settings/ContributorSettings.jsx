import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Divider } from "@mui/material";
import supabase from "../../../services/client";
import ContributorManageButton from "./ContributorManageButton";
import styles from "./ContributorSettings.module.css";
import ContributorGroupInput from "./ContributorGroupInput";

export default function ContributorSettings({ projectId }) {
  const [contributors, setContributors] = useState([]);

  const getContributors = async () => {
    try {
      const { data: userData, error } = await supabase
        .from("project_users")
        .select("id, role, group, user_firstname, user_lastname")
        .match({
          pending: false,
          project_uuid: projectId,
        });

      if (error) {
        throw error;
      } else {
        setContributors(userData);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getContributors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div>
          <p>Nom</p>
          <p>Rôle</p>
          <p>Groupe</p>
          <p>-</p>
        </div>
        <Divider sx={{ bgcolor: "#e8e8e8", height: "2px" }} />
      </header>
      <ul>
        {contributors.map((user) => {
          return (
            <li key={user.id}>
              <div className={styles.row}>
                <p>{`${user.user_firstname} ${user.user_lastname}`}</p>
                <p>{user.role === "owner" ? "Admin" : "Membre"}</p>
                <ContributorGroupInput
                  user={user}
                  contributors={contributors}
                  setContributors={setContributors}
                />
                <div className={styles.button}>
                  <ContributorManageButton
                    user={user}
                    contributors={contributors}
                    setContributors={setContributors}
                  />
                </div>
              </div>
              <Divider sx={{ bgcolor: "#e8e8e8", height: "1px" }} />
            </li>
          );
        })}
      </ul>
    </>
  );
}

ContributorSettings.propTypes = {
  projectId: PropTypes.string.isRequired,
};
