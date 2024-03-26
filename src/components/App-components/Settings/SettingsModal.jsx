import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Dialog, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import SettingsModalHeader from "./SettingsModalHeader";
import SettingsModalContent from "./SettingsModalContent";
import supabase from "../../../services/client";

export default function SettingsModal({
  open,
  handleClose,
  generalSettingsUpdated,
  haveGeneralSettingsBeenUpdated,
  openConfirmUpdate,
  setOpenConfirmUpdate,
  setOpenSettings,
}) {
  const [content, setContent] = useState("Général");
  const theme = useTheme();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingUsersLength, setPendingUsersLength] = useState(0);
  // To keep the id of the project using params
  const getProjectId = useParams();
  const projectId = getProjectId.uuid;

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
        console.info(userData);
        setPendingUsersLength(userData.length);
        console.info(userData.length);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getPendingUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
        pendingUsersLength={pendingUsersLength}
      />
      <SettingsModalContent
        content={content}
        setContent={setContent}
        haveGeneralSettingsBeenUpdated={haveGeneralSettingsBeenUpdated}
        openConfirmUpdate={openConfirmUpdate}
        setOpenConfirmUpdate={setOpenConfirmUpdate}
        setOpenSettings={setOpenSettings}
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
};
