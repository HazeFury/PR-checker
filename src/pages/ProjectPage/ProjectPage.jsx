import { useOutletContext } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { Button, CircularProgress } from "@mui/material";
import { Refresh } from "@mui/icons-material";
import ProjectCard from "../../components/App-components/ProjectCard/ProjectCard";
import supabase from "../../services/client";
import styles from "./ProjectPage.module.css";
import refreshContext from "../../contexts/RefreshContext";
import useScreenSize from "../../hooks/useScreenSize";
import subscribeToNewChannel from "../../services/utilities/subscribingToChannel";

export default function ProjectPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [arrayOfProjectsToWatch, setArrayOfProjectsToWatch] = useState([]);
  const [userId] = useOutletContext();
  const { refreshData, setRefreshData } = useContext(refreshContext);
  const screenSize = useScreenSize();

  const handleRefresh = () => {
    setRefreshData(!refreshData);
  };

  useEffect(() => {
    async function getProjects() {
      if (userId !== null) {
        const { data: projectsData } = await supabase
          .from("projects")
          .select("*, project_users!inner(*)")
          .eq("project_users.user_uuid", userId);
        // this request fetch only projects that user is related to
        setProjects(projectsData);
        const projectIds = projectsData.map((project) => project.id);
        // the following state is useful for keep the project ids only in a array in order to subscibe to to changes on them
        setArrayOfProjectsToWatch(projectIds);
        setLoading(false);
      }
    }
    getProjects();
  }, [userId, refreshData]);

  // ---------------------- SUBSCRIBE TO DATABASE CHANGES --------------------
  // Subscribe to database changes to refresh data when it's necessary

  // changes on project_users :
  subscribeToNewChannel(
    "home-project-user-room",
    "project_users",
    "user_uuid",
    "eq",
    userId,
    handleRefresh
  );

  // changes on projects :
  subscribeToNewChannel(
    "home-project-room",
    "projects",
    "id",
    "in",
    arrayOfProjectsToWatch,
    handleRefresh
  );

  useEffect(() => {
    return () => {
      supabase.removeAllChannels(); // unsubscribe from channels when unmounting the component
    };
  }, []);

  // -----------------------------------------------------------------------------

  if (loading)
    return (
      <div className={styles.loading_container}>
        <CircularProgress size={100} thickness={4} />
      </div>
    );

  return (
    <div className={styles.container}>
      <div className={styles.header_project_box}>
        <h2 className={styles.title}>Mes projets</h2>
        <Button
          variant="contained"
          sx={{
            background: "#3883ba",
            fontFamily: "Montserrat, sans serif",
            mx: 2,
            my: 2,
            "&.MuiButtonBase-root": { mr: 0 },
          }}
          onClick={handleRefresh}
        >
          {screenSize > 440 ? "Actualiser" : <Refresh />}
        </Button>
      </div>
      <div className={styles.project_container}>
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p className={styles.no_content_text}>
            Vous ne faites partie d&#39;aucun projet pour l&#39;instant
          </p>
        )}
        {screenSize > 970 && <div className={styles.hidden} />}
        {screenSize > 1486 && <div className={styles.hidden} />}
      </div>
    </div>
  );
}
