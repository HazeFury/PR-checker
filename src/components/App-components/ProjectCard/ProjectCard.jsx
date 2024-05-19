import { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useOutletContext } from "react-router-dom";
import supabase from "../../../services/client";
import styles from "./ProjectCard.module.css";
import RefreshUser from "../../../contexts/RefreshUser";
import refreshContext from "../../../contexts/RefreshContext";

export default function ProjectCard({ project }) {
  const [userId] = useOutletContext();
  const { refreshUser } = useContext(RefreshUser);
  const { refreshData } = useContext(refreshContext);
  const [projectUserRole, setProjectUserRole] = useState(null);

  async function fetchProjectUsers() {
    try {
      const { data: isCreatorId, error } = await supabase
        .from("project_users")
        .select("*")
        .match({ project_uuid: project.id, role: "owner" })
        .order("id", { ascending: true })
        .limit(1);

      if (error) {
        throw error;
      } else {
        const projectUsers = isCreatorId[0].user_uuid;
        if (userId !== undefined && projectUsers !== null) {
          if (isCreatorId[0].role === "owner" && projectUsers === userId) {
            setProjectUserRole("Propriétaire");
          } else if (
            project.project_users[0].role === "owner" &&
            projectUsers !== userId
          ) {
            setProjectUserRole("Admin");
          } else {
            setProjectUserRole("Contributeur");
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchProjectUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id, userId, refreshData, refreshUser]);

  const userIsPending = project.project_users[0].pending === true;
  return (
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
            {projectUserRole && (
              <div
                className={`${styles.projectRoles} ${
                  projectUserRole === "Contributeur"
                    ? styles.contributorBackground
                    : styles.adminBackground
                }`}
              >
                <span>{projectUserRole}</span>
              </div>
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
                  {project.totalUsers === 1 ? "contributeur" : "contributeurs"}{" "}
                </p>
              )}
            {project.totalPRWaiting !== undefined &&
              project.totalPRWaiting !== null && (
                <p className={styles.projectPRWaiting}>
                  {project.totalPRWaiting}{" "}
                  {project.totalPRWaiting === 1 ? "demande" : "demandes"} de PR
                  en cours
                </p>
              )}
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
        id: PropTypes.number.isRequired,
        project_uuid: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        pending: PropTypes.bool.isRequired,
      })
    ).isRequired,
  }).isRequired,
};
