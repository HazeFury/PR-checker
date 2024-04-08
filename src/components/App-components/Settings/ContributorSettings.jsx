import PropTypes from "prop-types";
import { Divider, Skeleton, Tooltip } from "@mui/material";
import { Star } from "@mui/icons-material";
import ContributorManageButton from "./ContributorManageButton";
import useScreenSize from "../../../hooks/useScreenSize";
import styles from "./ContributorSettings.module.css";

export default function ContributorSettings({
  userId,
  contributors,
  setContributors,
}) {
  const screenSize = useScreenSize();

  const projectOwner = contributors
    .slice()
    .sort((a, b) => a.id - b.id)
    .shift();

  const connectedAdmin = contributors
    .slice()
    .filter((el) => el.user_uuid === userId)[0];

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
                    {user === connectedAdmin ? "(moi)" : null}{" "}
                    {user.role === "owner" ? (
                      <Tooltip
                        title={user === projectOwner ? "Propriétaire" : "Admin"}
                        placement="top"
                        arrow
                      >
                        <Star
                          sx={{
                            color:
                              user === projectOwner
                                ? "goldenrod"
                                : "var(--action)",
                            fontSize: "1em",
                          }}
                        />
                      </Tooltip>
                    ) : null}
                  </p>{" "}
                  {screenSize > 767 && (
                    <p className={styles.group}>
                      {user.role !== "owner" ? user.group : "-"}
                    </p>
                  )}
                </div>
                <div>
                  <div className={styles.button}>
                    <ContributorManageButton
                      projectOwner={projectOwner}
                      connectedAdmin={connectedAdmin}
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
  userId: PropTypes.string.isRequired,
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
