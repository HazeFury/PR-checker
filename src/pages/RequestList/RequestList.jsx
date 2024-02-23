import { Box, Button, Modal } from "@mui/material";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import RequestCard from "../../components/App-components/RequestCard/RequestCard";

import supabase from "../../services/client";
import styles from "./RequestList.module.css";
import ModalFormRequest from "../../components/App-components/ModalForms/ModalFormRequest";

export default function RequestList() {
  const [loading, setLoading] = useState(true);
  const [requestList, setRequestList] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [open, setOpen] = useState(false);

  // To keep the id of the project
  const getProjectId = useParams();
  const projectId = getProjectId.uuid;

  // Function to get all own pull request
  async function getAllPr() {
    const { data } = await supabase
      .from("pr_request")
      .select("*")
      .eq("project_uuid", projectId);

    setRequestList(data);
    setLoading(false);
  }

  // Function to get the name of the project
  async function getProjectName() {
    const { data } = await supabase
      .from("projects")
      .select("name")
      .eq("id", projectId)
      .single();

    setProjectName(data.name);
  }

  // To show all pr and project name at the beggining of the page
  useEffect(() => {
    getAllPr();
    getProjectName();
  }, []);

  // Loader
  if (loading)
    return (
      <div className={styles.request_list_container}>
        <CircularProgress />
      </div>
    );
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    height: 600,
    bgcolor: "#292929",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    display: "flex",
    justifyContent: "center",
  };
  return (
    <div className={styles.request_list_container}>
      <div className={styles.head}>
        <p>{projectName}</p>
        <div>
          <Button
            variant="contained"
            sx={{
              width: ["100%", "100%", "100%"],
              background: "#3883ba",
              fontFamily: "Montserrat, sans serif",
            }}
            onClick={handleOpen}
          >
            Nouvelle demande{" "}
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              {" "}
              <ModalFormRequest title="Enregistrer" text="Enregistrer" />
            </Box>
          </Modal>
        </div>
      </div>
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
