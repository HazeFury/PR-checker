import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import RequestCard from "../../components/App-components/RequestCard/RequestCard";
import supabase from "../../services/client";
import styles from "./RequestList.module.css";

export default function RequestList() {
  const [loading, setLoading] = useState(true);
  const [requestList, setRequestList] = useState([]);
  const [projectName, setProjectName] = useState("");

  const getProjectId = useParams();
  const projectId = getProjectId.uuid;

  async function getAllPr() {
    const { data } = await supabase
      .from("pr_request")
      .select("*")
      .eq("project_uuid", projectId);

    setRequestList(data);
    setLoading(false);
  }

  async function getProjectName() {
    const { data } = await supabase
      .from("projects")
      .select("name")
      .eq("id", projectId)
      .single();

    setProjectName(data.name);
  }

  useEffect(() => {
    getAllPr();
    getProjectName();
  }, []);

  if (loading)
    return (
      <div className={styles.request_list_container}>
        <CircularProgress />
      </div>
    );

  return (
    <div className={styles.request_list_container}>
      <p>{projectName}</p>
      {requestList.length > 0 ? (
        requestList.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))
      ) : (
        <p className={styles.no_content_text}>
          Ce projet ne contient pas de demande de PR !
        </p>
      )}
    </div>
  );
}
