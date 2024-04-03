import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Divider, Skeleton, Tooltip } from "@mui/material";
import { Star } from "@mui/icons-material";
import supabase from "../../../services/client";
import ContributorManageButton from "./ContributorManageButton";
import useScreenSize from "../../../hooks/useScreenSize";
import styles from "./ContributorSettings.module.css";

export default function ContributorSettings({ projectId, userId }) {
  const [contributors, setContributors] = useState([]);
  const screenSize = useScreenSize();

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
            .sort((a, b) => a.group - b.group)
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
            {screenSize > 767 && <li className={styles.group}>Groupe</li>}
          </div>
          <div>
            <li className={styles.button}>-</li>
          </div>
        </ul>
        <Divider sx={{ bgcolor: "#e8e8e8", height: "2px" }} />
      </header>
      {!contributors.length && (
        // Loading content
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: "3" }}>
              <Skeleton
                variant="text"
                animation="wave"
                width={180}
                sx={{
                  fontSize: "1.5rem",
                  marginBlock: "1rem",
                  bgcolor: "#e8e8e820",
                }}
              />
            </div>
            {screenSize > 767 && (
              <div style={{ flex: "1" }}>
                <Skeleton
                  variant="text"
                  animation="wave"
                  width={40}
                  sx={{
                    fontSize: "1.5rem",
                    margin: "1rem auto",
                    bgcolor: "#e8e8e820",
                  }}
                />
              </div>
            )}
            <div style={{ flex: screenSize > 767 ? "3" : "1" }}>
              <Skeleton
                variant="text"
                animation="wave"
                width={screenSize > 767 ? 120 : 80}
                sx={{
                  fontSize: "1.5rem",
                  margin: `1rem calc(100% - ${screenSize > 767 ? "120px" : "80px"})`,
                  bgcolor: "#e8e8e820",
                }}
              />
            </div>
          </div>
          <Skeleton
            variant="rectangular"
            animation="wave"
            height={5}
            sx={{ bgcolor: "#e8e8e820" }}
          />
        </>
      )}
      <ul>
        {contributors.map((user) => {
          return (
            <li key={user.id}>
              <div className={styles.row}>
                <div>
                  <p className={styles.name}>
                    {`${user.user_firstname} ${user.user_lastname}`}{" "}
                    {user.role === "owner" ? (
                      <Tooltip title="Admin" placement="top" arrow>
                        <Star sx={{ color: "goldenrod", fontSize: "1em" }} />
                      </Tooltip>
                    ) : null}
                  </p>{" "}
                  {screenSize > 767 && (
                    <p className={styles.group}>{user.group}</p>
                  )}
                </div>
                <div>
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
