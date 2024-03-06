import { Box, Button, Modal } from "@mui/material";
import { useState, useEffect, useContext } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import RequestCard from "../../components/App-components/RequestCard/RequestCard";
import supabase from "../../services/client";
import styles from "./RequestList.module.css";
import ModalFormRequest from "../../components/App-components/Modals/ModalFormRequest";
import ConfirmationModal from "../../components/App-components/Modals/ConfirmationModal";
import refreshContext from "../../contexts/RefreshContext";
import DropDownMenu from "../../components/UI-components/MUIRemix/DropDownMenu";

const filters = [
  {
    Statut: [
      ["Tous", "0"],
      ["En attente de review", "1"],
      ["En cours de review", "2"],
      ["En attente de correctifs", "3"],
      ["Correctifs faits", "4"],
      ["Demande rejetée", "5"],
      ["Demande validée", "6"],
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

export default function RequestList() {
  // ------------------------ (1) Initial values -------------------------------------

  // state for loader
  const [loading, setLoading] = useState(true);
  // state for the role of the user
  const [userRole, setUserRole] = useState(null);
  // get the userId from the context of the Outlet
  const [userId] = useOutletContext();
  // import the refresh state to actualize the list
  const { refreshData, setRefreshData } = useContext(refreshContext);
  // useNavigate to navigate to different page
  const navigate = useNavigate();
  // To keep the id of the project using params
  const getProjectId = useParams();
  const projectId = getProjectId.uuid;
  // states for requestList and projectName
  const [requestList, setRequestList] = useState([]);
  const [projectName, setProjectName] = useState("");
  // state to save the Id of the PR that will be used
  const [requestId, setRequestId] = useState(null);
  // state for open request and confirmation modals
  const [openModalAboutRequest, setopenModalAboutRequest] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  // states for filters
  const [selectedFilters, setSelectedFilters] = useState(null);
  const [filteredRequestList, setFilteredRequestList] = useState([]);
  const [haveFiltersBeenUsed, setHaveFiltersBeenUsed] = useState(false);
  // -------------------------------------------------------------------------------

  // ---------------------------- (2) handle function ------------------------------

  // Function to refresh
  const handleRefresh = () => {
    setRefreshData(!refreshData);
  };
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
  // --------------------------------------------------------------------------------

  // --------------------------- (3) Async function ---------------------------------

  // Function to verify if the user can view the request of this project
  async function verifyUser() {
    const { data: userAccess } = await supabase
      .from("project_users")
      .select("*")
      .match({ user_uuid: userId, project_uuid: projectId })
      .single();

    return userAccess; // the response will be either "null" or an object containing user information
  }

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
  // ----------------------------------------------------------------------------------

  // ---------------------- (4) Mounting the component (useEffect) --------------------

  // When mounting the component, we check if the connected user has the right to see the requests
  useEffect(() => {
    const fetchVerifiedUser = async () => {
      const verifiedUser = await verifyUser();
      if (verifiedUser !== null && verifiedUser.pending === false) {
        // if the user exist and the pending === false, we can fetch all the request and we set the role
        setUserRole(verifiedUser.role); // userRole can only be "owner" or "contributor"
        getProjectName();
        getAllPr();
      }
      if (verifiedUser === null) {
        // if the user doesn't exist on this project (or if pending = true), he is returned to the error page
        navigate("/error");
      }
    };
    fetchVerifiedUser();
    return () => {
      setUserRole(null); // set null to userRole on component unmounting
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // ----------------------------
  // this useEffect is just used to refetch data when you press the "actualiser" button
  useEffect(() => {
    if (userRole !== null) {
      getAllPr();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshData]); // the dependancy needed to refetch data

  useEffect(() => {
    // used for filtering everytime a new filter is selected
    let requestsToDisplay = requestList;
    if (selectedFilters?.Statut?.join("") !== "0") {
      requestsToDisplay = requestsToDisplay.filter(
        (el) => selectedFilters.Statut.indexOf(`${el.status}`) !== -1
      );
    }
    if (
      userRole === "contributor" &&
      selectedFilters?.Demandes?.join("") === "1"
    ) {
      requestsToDisplay = requestsToDisplay.filter(
        (el) => el.user_uuid === userId
      );
    }

    setFilteredRequestList(requestsToDisplay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters]);
  // ----------------------------------------------------------------------------------

  // Loader
  if (loading)
    return (
      <div className={styles.requests_container}>
        <CircularProgress />
      </div>
    );

  // modal style
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: 700,
    bgcolor: "#292929",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    display: "flex",
    justifyContent: "center",
    width: {
      sm: "400px",
      md: "450px",
      lg: "500px",
      xl: "550px",
    },
  };

  return (
    <div className={styles.request_list_container}>
      <div className={styles.head}>
        <div>
          <h3>{projectName}</h3>
          <div className={styles.head_btn_box}>
            <Button
              variant="contained"
              sx={{
                background: "#3883ba",
                fontFamily: "Montserrat, sans serif",
                mx: 2,
                my: 2,
              }}
              onClick={handleRefresh}
            >
              Actualiser{" "}
            </Button>
            <Button
              variant="contained"
              sx={{
                background: "#3883ba",
                fontFamily: "Montserrat, sans serif",
                mx: 2,
                my: 2,
              }}
              onClick={handleOpenModalAboutRequest}
            >
              Nouvelle demande{" "}
            </Button>
          </div>
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
                refreshPr={handleRefresh}
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
        <div>
          <DropDownMenu
            buttonText="Filtres"
            menuItems={userRole === "contributor" ? filters : [filters[0]]}
            user={userRole}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            disabled={!requestList.length}
            haveFiltersBeenUsed={haveFiltersBeenUsed}
            setHaveFiltersBeenUsed={setHaveFiltersBeenUsed}
          />
        </div>
      </div>
      <div className={styles.requests_container}>
        {filteredRequestList.length > 0
          ? filteredRequestList.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                handleOpenModalAboutRequest={handleOpenModalAboutRequest}
              />
            ))
          : null}
        {filteredRequestList.length === 0 && haveFiltersBeenUsed ? (
          <p className={styles.no_content_text}>
            Aucune demande de PR ne correspond à votre recherche
          </p>
        ) : null}
        {requestList.length === 0 && !haveFiltersBeenUsed ? (
          <p className={styles.no_content_text}>
            Ce projet ne contient pas de demande de PR !
          </p>
        ) : null}
      </div>
    </div>
  );
}
