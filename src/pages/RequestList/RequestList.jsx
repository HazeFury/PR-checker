import { Box, Button, Modal } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import RequestCard from "../../components/App-components/RequestCard/RequestCard";
import supabase from "../../services/client";
import styles from "./RequestList.module.css";
import ModalFormRequest from "../../components/App-components/Modals/ModalFormRequest";
import ConfirmationModal from "../../components/App-components/Modals/ConfirmationModal";
import DropDownMenu from "../../components/UI-components/MUIRemix/DropDownMenu";

const filters = [
  {
    Statut: [
      ["Tous", "0"],
      ["En attente de review", "1"],
      ["En cours de review", "2"],
      ["En attente de correctifs", "3"],
      ["Correctifs faits", "4"],
      ["Demande validée", "5"],
      ["Demande rejetée", "6"],
    ],
  },
  {
    Demandes: [
      ["Toutes", "0"],
      ["Moi", "1"],
      ["Mon groupe", "2"],
    ],
  },
];

const USER = "membre";

export default function RequestList() {
  // state for loader
  const [loading, setLoading] = useState(true);
  // states for requestList
  const [requestList, setRequestList] = useState([]);
  const [projectName, setProjectName] = useState("");
  // state to save the Id of the PR that will be used
  const [requestId, setRequestId] = useState(null);
  // state for open request and confirmation modals
  const [openModalAboutRequest, setopenModalAboutRequest] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  // function to manage the state to open the modal about Request and modal for confirmation
  const handleOpenModalAboutRequest = (id) => {
    setRequestId(id);

    setopenModalAboutRequest(true);
  };
  const handleOpenConfirmationModal = () => setOpenConfirmationModal(true);
  // Function to close all modals at the same time after confirm the close
  const handleCloseModals = () => {
    setopenModalAboutRequest(false);
    setOpenConfirmationModal(false);
  };
  // Function to re-open request modal after don't confirm the exit of the modal
  const handleReOpenRequestModal = () => {
    setOpenConfirmationModal(false);
    setopenModalAboutRequest(true);
  };

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

  // To show all pr and project name at the beggining
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

  // modal style
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    height: 700,
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
        <div>
          <h3>{projectName}</h3>
          <div>
            <Button
              variant="contained"
              sx={{
                width: ["100%", "100%", "100%"],
                background: "#3883ba",
                fontFamily: "Montserrat, sans serif",
              }}
              onClick={handleOpenModalAboutRequest}
            >
              Nouvelle demande{" "}
            </Button>
            <Modal
              open={openModalAboutRequest}
              onClose={() => {
                handleOpenConfirmationModal();
              }}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                {" "}
                <ModalFormRequest
                  title="Enregistrer"
                  text="Enregistrer"
                  projectId={projectId}
                  handleClose={handleCloseModals}
                  handleOpenConfirmationModal={handleOpenConfirmationModal}
                  refreshPr={() => getAllPr()}
                  requestId={requestId}
                />
                {openConfirmationModal && (
                  <ConfirmationModal
                    title="Voulez-vous vraiment quitter votre enregistrement ?"
                    textButtonLeft="Revenir à mon enregistrement"
                    textButtonRight="Quitter"
                    handleCloseModals={() => {
                      handleCloseModals();
                    }}
                    handleOpenRequestModal={() => {
                      handleReOpenRequestModal();
                    }}
                  />
                )}
              </Box>
            </Modal>
          </div>
        </div>
        <div>
          <DropDownMenu
            buttonText="Filtres"
            menuItems={USER === "membre" ? filters : [filters[0]]}
            user={USER}
          />
        </div>
      </div>
      {requestList.length > 0 ? (
        requestList.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            handleOpenModalAboutRequest={handleOpenModalAboutRequest}
          />
        ))
      ) : (
        <p className={styles.no_content_text}>
          Ce projet ne contient pas de demande de PR !
        </p>
      )}
    </div>
  );
}
