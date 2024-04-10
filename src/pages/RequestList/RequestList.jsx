import { Button } from "@mui/material";
import { Add, Refresh } from "@mui/icons-material";
import { useState, useEffect, useContext } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
// eslint-disable-next-line import/no-unresolved
import { toast } from "sonner";
import RequestCard from "../../components/App-components/RequestCard/RequestCard";
import supabase from "../../services/client";
import styles from "./RequestList.module.css";
import ModalFormRequest from "../../components/App-components/Modals/ModalFormRequest";
import ConfirmationModal from "../../components/App-components/Modals/ConfirmationModal";
import refreshContext from "../../contexts/RefreshContext";
import DropDownMenu from "../../components/App-components/Filters/DropDownMenu";
import useScreenSize from "../../hooks/useScreenSize";
import UserContext from "../../contexts/UserContext";

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
      ["Mon groupe", "1"],
      ["Moi", "2"],
    ],
  },
];

export default function RequestList() {
  // ------------------------ (1) Initial values -------------------------------------

  // state for loader
  const [loading, setLoading] = useState(true);
  // state for the role of the user
  const { userRole, setUserRole } = useContext(UserContext);
  // get the userId from the context of the Outlet
  const [userId] = useOutletContext();
  // import the refresh state to actualize the list
  const { refreshData, setRefreshData } = useContext(refreshContext);
  // useNavigate to navigate to different page
  const navigate = useNavigate();
  // To keep the id of the project using params
  const getProjectId = useParams();
  const projectId = getProjectId.uuid;
  // states for requestList, projectName and projectStatus
  const [requestList, setRequestList] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectStatus, setProjectStatus] = useState(null);
  // state to save the Id of the PR that will be used
  const [requestId, setRequestId] = useState(null);
  // state for open request and confirmation modals
  const [openModalAboutRequest, setopenModalAboutRequest] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  // states for filters
  const [selectedFilters, setSelectedFilters] = useState(null);
  const [filteredRequestList, setFilteredRequestList] = useState([]);
  const [groupIds, setGroupIds] = useState(null);
  const [haveFiltersBeenUsed, setHaveFiltersBeenUsed] = useState(false);
  const [sortBy, setSortBy] = useState("old");
  // for styling
  const screenSize = useScreenSize();
  // -------------------------------------------------------------------------------

  // --------------------------- (2) Async function ---------------------------------

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
  async function getProjectData() {
    const { data } = await supabase
      .from("projects")
      .select("name, status")
      .eq("id", projectId)
      .single();

    setProjectName(data.name);
    setProjectStatus(data.status);
  }
  // function to delete a PR
  const deleteRequest = async (id) => {
    try {
      await supabase.from("pr_request").delete().eq("id", id);
      toast.success("La PR a bien été supprimée");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la PR");
    }
  };

  const getGroupIds = async (groupId) => {
    // Get uuids from users belonging to the same group in the same project
    try {
      const { data: groupData } = await supabase
        .from("project_users")
        .select("user_uuid")
        .match({ project_uuid: projectId, group: groupId });

      setGroupIds(groupData);
    } catch (error) {
      console.error(error);
    }
  };
  // --------------------------------------------------------------------------------

  // ---------------------------- (3) handle function ------------------------------

  // Function to refresh
  const handleRefresh = () => {
    setRefreshData(!refreshData);
  };
  // function to manage the state to open the modal to edit a PR
  const handleOpenModalToEditRequest = (id) => {
    setRequestId(id);
    setopenModalAboutRequest(true);
  };
  // function to manage the state to open the modal to create a new PR
  const handleOpenModalForNewRequest = () => {
    setopenModalAboutRequest(true);
  };
  //  function to manage the state to open the confirmation modal
  const handleOpenConfirmationModal = (id) => {
    setRequestId(id);
    setOpenConfirmationModal(true);
  };
  // Function to close all modals at the same time after confirm the close
  const handleCloseModals = () => {
    setopenModalAboutRequest(false);
    setOpenConfirmationModal(false);
    setRequestId(null);
  };
  // Function to re-open request modal after don't confirm the exit of the modal
  const handleReOpenRequestModal = (id) => {
    setRequestId(id);
    setOpenConfirmationModal(false);
    setopenModalAboutRequest(true);
  };
  // Function to delete a request then refresh PRlist
  const handleDeleteRequest = async (id) => {
    await deleteRequest(id);
    setRefreshData(!refreshData);
  };
  // Function to refresh PRlist and PRcards after create or edit a PR
  const handleCreateOrUpdateRequest = async () => {
    setRefreshData(!refreshData);
    setRequestId(null);
  };

  // ----------------------------------------------------------------------------------

  // ---------------------- (4) Mounting the component (useEffect) --------------------

  // When mounting the component, we check if the connected user has the right to see the requests
  useEffect(() => {
    const fetchVerifiedUser = async () => {
      if (userId !== null) {
        const verifiedUser = await verifyUser();
        if (verifiedUser !== null && verifiedUser.pending === false) {
          // if the user exist and the pending === false, we can fetch all the request and we set the role
          setUserRole(verifiedUser.role); // userRole can only be "owner" or "contributor"
          getProjectData();
          getAllPr();
          getGroupIds(verifiedUser.group);
        }
        if (verifiedUser === null) {
          // if the user doesn't exist on this project (or if pending = true), he is returned to the error page
          navigate("/error");
        }
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
      getProjectData();
      getAllPr();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshData]);
  // ----- Used for updating the sort priority when component is first rendered depending on owner or contributor status -----
  useEffect(() => {
    if (userRole !== null) {
      setSortBy(userRole === "owner" ? "old" : "new");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);
  // ----- Used for filtering PR requests everytime a new filter is selected -----
  useEffect(() => {
    let requestsToDisplay = requestList;
    // Creates a copy of requestLis, then tries to filters on PR status first
    if (selectedFilters?.Statut?.join("") !== "0") {
      requestsToDisplay = requestsToDisplay.filter(
        (el) => selectedFilters?.Statut?.indexOf(`${el.status}`) !== -1
      );
    }
    // If user is contributor, tries to filter on PR creator id
    if (
      userRole === "contributor" &&
      selectedFilters?.Demandes?.join("") === "2"
    ) {
      requestsToDisplay = requestsToDisplay.filter(
        (el) => el.user_uuid === userId
      );
    }

    if (
      userRole === "contributor" &&
      selectedFilters?.Demandes?.join("") === "1"
    ) {
      requestsToDisplay = requestsToDisplay.filter((el) =>
        groupIds?.some((user) => user.user_uuid === el.user_uuid)
      );
    }

    // Sort is happening after content has been filtered
    requestsToDisplay.sort((a, b) =>
      sortBy === "old"
        ? new Date(a.created_at) - new Date(b.created_at)
        : new Date(b.created_at) - new Date(a.created_at)
    );
    // Once it's all filtered and sorted, we can pass it to our state in order to display the results
    setFilteredRequestList(requestsToDisplay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters, requestList, sortBy]);

  // ----------------------------------------------------------------------------------

  // Loader
  if (loading)
    return (
      <div className={styles.loader}>
        <CircularProgress size={100} thickness={4} />
      </div>
    );

  return (
    <div className={styles.request_list_container}>
      <div className={styles.head}>
        <h3>{projectName}</h3>
        <div className={styles.head_btn}>
          <div className={styles.head_btn_new}>
            <Button
              variant="contained"
              sx={{
                bgcolor: "button.main",
              }}
              onClick={handleRefresh}
            >
              {screenSize < 767 ? <Refresh /> : "Actualiser"}
            </Button>
            {userRole === "contributor" && (
              <Button
                variant="contained"
                sx={{
                  bgcolor: "button.main",
                }}
                onClick={handleOpenModalForNewRequest}
                disabled={projectStatus === false}
              >
                {screenSize < 767 ? <Add /> : "Nouvelle demande"}
              </Button>
            )}
          </div>{" "}
          {openModalAboutRequest && (
            <ModalFormRequest
              title="Enregistrer"
              text="Enregistrer"
              projectId={projectId}
              handleClose={handleCloseModals}
              handleOpenConfirmationModal={handleOpenConfirmationModal}
              handleCreateOrUpdateRequest={handleCreateOrUpdateRequest}
              requestId={requestId}
              openModalAboutRequest={openModalAboutRequest}
              handleReOpenRequestModal={handleReOpenRequestModal}
              openConfirmationModal={openConfirmationModal}
              handleCloseModals={handleCloseModals}
            />
          )}
          <div className={styles.head_btn_filters}>
            <DropDownMenu
              buttonText="Filtres"
              menuItems={userRole === "contributor" ? filters : [filters[0]]}
              user={userRole}
              selectedFilters={selectedFilters}
              setSelectedFilters={setSelectedFilters}
              disabled={!requestList.length}
              haveFiltersBeenUsed={haveFiltersBeenUsed}
              setHaveFiltersBeenUsed={setHaveFiltersBeenUsed}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
        </div>
      </div>
      <div className={styles.requests_container}>
        {filteredRequestList.length > 0
          ? filteredRequestList.map((request) => (
              <RequestCard
                key={request.id}
                userRole={userRole}
                request={request}
                handleOpenModalAboutRequest={handleOpenModalToEditRequest}
                handleOpenConfirmationModal={() =>
                  handleOpenConfirmationModal(request.id)
                }
              />
            ))
          : null}
        {openConfirmationModal && (
          <ConfirmationModal
            title="Voulez-vous vraiment supprimer cette demande de PR ?"
            textButtonLeft="Annuler"
            textButtonRight="Supprimer"
            handleRightButtonClick={() => {
              handleDeleteRequest(requestId);
              handleCloseModals();
            }}
            handleLeftButtonClick={() => {
              handleCloseModals();
            }}
          />
        )}
        {filteredRequestList.length === 0 && requestList.length !== 0 ? (
          <p className={styles.no_content_text}>
            Aucune demande de PR ne correspond aux filtres sélectionnés
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
