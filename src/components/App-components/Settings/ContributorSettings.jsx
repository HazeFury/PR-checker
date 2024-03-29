import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Divider } from "@mui/material";
import supabase from "../../../services/client";
import ContributorManageButton from "./ContributorManageButton";
import styles from "./ContributorSettings.module.css";
import ContributorGroupInput from "./ContributorGroupInput";

export default function ContributorSettings({ projectId, userId }) {
  const [contributors, setContributors] = useState([]);

  const getContributors = async () => {
    try {
      const { data: userData, error } = await supabase
        .from("project_users")
        .select("id, user_uuid, role, group, user_firstname, user_lastname")
        .match({
          pending: false,
          project_uuid: projectId,
        });

      if (error) {
        throw error;
      } else {
        setContributors(
          userData
            // Sorting members by group and removing connected owner from list
            .sort((a, b) => a.group + b.group)
            .filter((el) => el.user_uuid !== userId)
        );
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
        <ul>
          <div>
            <li className={styles.name}>Nom</li>
            <li className={styles.role}>Rôle</li>
          </div>
          <div>
            <li className={styles.group}>Groupe</li>
            <li className={styles.button}>-</li>
          </div>
        </ul>
        <Divider sx={{ bgcolor: "#e8e8e8", height: "2px" }} />
      </header>
      <ul>
        {contributors.map((user) => {
          return (
            <li key={user.id}>
              <div className={styles.row}>
                <div>
                  <p className={styles.name}>
                    {`${user.user_firstname} ${user.user_lastname}`}
                  </p>
                  <p className={styles.role}>
                    {user.role === "owner" ? "Admin" : "Membre"}
                  </p>
                </div>
                <div>
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
  userId: PropTypes.string.isRequired,
};
