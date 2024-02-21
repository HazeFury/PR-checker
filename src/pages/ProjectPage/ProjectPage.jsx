import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import ProjectCard from "../../components/App-components/ProjectCard/ProjectCard";
import supabase from "../../services/client";
import styles from "./ProjectPage.module.css";

export default function ProjectPage() {
  const [loading, setLoading] = useState(true);
  const [projects, setProject] = useState([]);

  useEffect(() => {
    async function getProjects() {
      const { data } = await supabase.auth.getSession();
      const userId = data.session.user.id;

      const { data: projectsData } = await supabase
        .from("projects")
        .select("*, project_users!inner(*)")
        .eq("project_users.user_uuid", userId);

      setProject(projectsData);
      setLoading(false);
    }

    getProjects();
  }, []);

  if (loading)
    return (
      <div className={styles.loading_container}>
        <CircularProgress />
      </div>
    );

  return (
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
    </div>
  );
}
