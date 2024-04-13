import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Dialog, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import SettingsModalHeader from "./SettingsModalHeader";
import SettingsModalContent from "./SettingsModalContent";
import supabase from "../../../services/client";
import refreshContext from "../../../contexts/RefreshContext";
import subscribeToNewChannel from "../../../services/utilities/subscribingToChannel";

export default function SettingsModal({
  open,
  handleClose,
  generalSettingsUpdated,
  haveGeneralSettingsBeenUpdated,
  openConfirmUpdate,
  setOpenConfirmUpdate,
  setOpenSettings,
  userId,
}) {
  const [content, setContent] = useState("Général");
  const theme = useTheme();
  const [contributors, setContributors] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  // To keep the id of the project using params
  const getProjectId = useParams();
  const projectId = getProjectId.uuid;
  const { refreshData, setRefreshData } = useContext(refreshContext);

  const handleRefresh = () => {
    setRefreshData(!refreshData);
  };

  // Fetch datas used in contributors settings
  const getContributors = async () => {
    try {
      const { data: userData, error } = await supabase
        .from("project_users")
        .select("id, user_uuid, role, group, user_firstname, user_lastname")
        .match({
          pending: false,
          project_uuid: projectId,
        });

      if (error) {
        throw error;
      } else {
        setContributors(
          userData
            // Sorting members by role, then by group, then by name
            .sort(
              (a, b) =>
                a.role.localeCompare(b.role) * -1 ||
                a.group - b.group ||
                a.user_firstname.localeCompare(b.user_firstname) ||
                a.user_lastname.localeCompare(b.user_lastname)
            )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // function to get the firstname and lastname of the users who are pending true for this project selected
  async function getPendingUsers() {
    try {
      const { data: userData, error } = await supabase
        .from("project_users")
        .select("id, user_firstname, user_lastname")
        .match({
          pending: true,
          project_uuid: projectId,
        });

      if (error) {
        console.error(error);
      } else {
        setPendingUsers(userData);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getContributors();
    getPendingUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshData]);

  // ---------------------- SUBSCRIBE TO DATABASE CHANGES --------------------
  // Subscribe to database changes to refresh data when it's necessary

  // changes on project_users :
  subscribeToNewChannel(
    "settings-room",
    "project_users",
    "project_uuid",
    "eq",
    projectId,
    handleRefresh
  );

  useEffect(() => {
    return () => {
      supabase.removeAllChannels(); // unsubscribe from channels when unmounting the component
    };
  }, []);
  // -----------------------------------------------------------------------------

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth={false}
      aria-labelledby="settings-dialog"
      PaperProps={{
        sx: {
          bgcolor: "modal.background",
          width: "60svw",
          height: "70svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem",

          [theme.breakpoints.down("sm")]: {
            width: "75svw",
          },
          [theme.breakpoints.down("md")]: {
            height: "85svh",
          },
          [theme.breakpoints.between("sm", "lg")]: {
            width: "70svw",
          },
          [theme.breakpoints.up("md")]: {
            maxHeight: "500px",
          },
        },
      }}
    >
      <IconButton
        sx={{
          position: "absolute",
          top: "0.2rem",
          right: "0.2rem",
          bgcolor: "button.secondary",
          width: "2.3rem",
          height: "2.5rem",
          borderRadius: "0px 5px 0px 10px",
          "&:hover": { bgcolor: "button.hover" },
        }}
        onClick={handleClose}
        aria-label="close"
      >
        <Close style={{ color: "white" }} />
      </IconButton>
      <SettingsModalHeader
        content={content}
        setContent={setContent}
        generalSettingsUpdated={generalSettingsUpdated}
        openConfirmUpdate={openConfirmUpdate}
        setOpenConfirmUpdate={setOpenConfirmUpdate}
        nbOfContributors={contributors.length}
        nbOfPending={pendingUsers.length}
      />
      <SettingsModalContent
        content={content}
        setContent={setContent}
        haveGeneralSettingsBeenUpdated={haveGeneralSettingsBeenUpdated}
        openConfirmUpdate={openConfirmUpdate}
        setOpenConfirmUpdate={setOpenConfirmUpdate}
        setOpenSettings={setOpenSettings}
        userId={userId}
        contributors={contributors}
        setContributors={setContributors}
        pendingUsers={pendingUsers}
      />
    </Dialog>
  );
}

SettingsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  generalSettingsUpdated: PropTypes.objectOf(PropTypes.bool).isRequired,
  haveGeneralSettingsBeenUpdated: PropTypes.func.isRequired,
  openConfirmUpdate: PropTypes.shape({
    closedSettings: PropTypes.bool.isRequired,
    changedSection: PropTypes.string.isRequired,
  }).isRequired,
  setOpenConfirmUpdate: PropTypes.func.isRequired,
  setOpenSettings: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};
