import PropTypes from "prop-types"; // Import PropTypes
import { Link } from "react-router-dom";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({ project }) {
  return (
    <Link to={`/project/${project.id}`}>
      <div className={styles.projectCardPage}>
        <div key={project.id} className={styles.projectCardContainer}>
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
      </div>
    </Link>
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
      })
    ).isRequired,
  }).isRequired,
};
