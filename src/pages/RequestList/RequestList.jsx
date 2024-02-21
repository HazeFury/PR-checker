import { useParams } from "react-router-dom";
import { supabase } from "../../services/client";
import { useState, useEffect } from "react";
import RequestCard from "../../components/App-components/RequestCard/RequestCard";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./RequestList.module.css";

export default function RequestList() {
  const [loading, setLoading] = useState(true);
  const [requestList, setRequestList] = useState([]);

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

  useEffect(() => {
    getAllPr();
  });

  if (loading)
    return (
      <div className={styles.request_list_container}>
        <CircularProgress />
      </div>
    );

  return (
    <div className={styles.request_list_container}>
      {requestList.length > 0 ? (
        requestList.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))
      ) : (
        <p className={styles.no_content_text}>
          Ce projet ne contient pas de demande de PR
        </p>
      )}
    </div>
  );
}
