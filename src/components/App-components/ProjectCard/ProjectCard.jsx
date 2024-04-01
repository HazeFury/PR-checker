import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project }) {
  const userIsPending = project.project_users[0].pending === true;
  return (
    <div className={styles.projectCardPage}>
      <Link to={userIsPending ? "/" : `/project/${project.id}`}>
        <div
          key={project.id}
          className={
            userIsPending
              ? styles.projectCardContainerDisabled
              : styles.projectCardContainer
          }
        >
          <img
            className={styles.projectCardPicture}
            src={project.picture}
            alt={project.name}
          />
          <div className={styles.projectCardContent}>
            <div className={styles.projectRoleStatus}>
              <div
                className={`${styles.projectStatus} ${
                  project.status === true
                    ? styles.blueBackground
                    : styles.redBackground
                }`}
              >
                <span className={styles.statusText}>
                  {project.status === true ? "En cours" : "Terminé"}
                </span>
              </div>
              {project.project_users[0].role === "owner" ? (
                <div className={styles.projectRoles}>
                  <span>Propriétaire</span>
                </div>
              ) : (
                ""
              )}
            </div>
            {userIsPending ? (
              <span className={styles.is_pending_info}>
                En attente d'acceptation
              </span>
            ) : (
              ""
            )}
            <h2 className={styles.projectName}>{project.name}</h2>
            <div className={styles.projectUsersPR}>
              {project.totalUsers !== undefined &&
                project.totalUsers !== null && (
                  <p className={styles.projectUsers}>
                    {project.totalUsers}{" "}
                    {project.totalUsers === 1
                      ? "contributeur"
                      : "contributeurs"}{" "}
                  </p>
                )}
              {project.totalPRWaiting !== undefined &&
                project.totalPRWaiting !== null && (
                  <p className={styles.projectPRWaiting}>
                    {project.totalPRWaiting}{" "}
                    {project.totalPRWaiting === 1 ? "demande" : "demandes"} de
                    PR en cours
                  </p>
                )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.bool.isRequired,
    totalUsers: PropTypes.number,
    totalPRWaiting: PropTypes.number,
    picture: PropTypes.string.isRequired,
    project_users: PropTypes.arrayOf(
      PropTypes.shape({
        role: PropTypes.string.isRequired,
        pending: PropTypes.bool.isRequired,
      })
    ).isRequired,
  }).isRequired,
};
