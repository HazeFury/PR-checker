import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  FormControlLabel,
  IconButton,
  Switch,
} from "@mui/material";
import { ContentCopy, Edit, Visibility } from "@mui/icons-material";
import { useTheme } from "@emotion/react";
import PropTypes from "prop-types";
// eslint-disable-next-line import/no-unresolved
import { toast } from "sonner";
import axios from "axios";
import styles from "./GeneralSettings.module.css";
import ConfirmationModal from "../Modals/ConfirmationModal";
import supabase from "../../../services/client";
import TooltipIcon from "../../UI-components/MUIRemix/TooltipIcon";

export default function GeneralSettings({
  projectData,
  getProjectData,
  haveGeneralSettingsBeenUpdated,
  openConfirmUpdate,
  setOpenConfirmUpdate,
  setOpenSettings,
  setContent,
}) {
  const [newData, setNewData] = useState({
    invitation: projectData.invitation,
    name: projectData.name,
    picture: projectData.picture,
    status: projectData.status,
  });
  const [modifyName, setModifyName] = useState(false); // for disabling/enabling project name input
  const [showPic, setShowPic] = useState(false); // for displaying project image
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false); // for confirmation modal on delete
  const navigate = useNavigate();
  const theme = useTheme();

  /* --- For enabling or not the save and reset buttons when there's new content --- */
  const checkForUpdates = () => {
    let updated = false;
    for (const data in newData) {
      if (newData[data] !== projectData[data]) {
        updated = true;
      }
    }
    return updated;
  };
  const updated = checkForUpdates();
  haveGeneralSettingsBeenUpdated(updated);

  /* --- Function for getting only the data that is different from the original project data --- */
  const getUpdatedDataOnly = () => {
    const updatedData = [];
    for (const [key, value] of Object.entries(newData)) {
      if (newData[key] !== projectData[key]) {
        updatedData.push([key, value]);
      }
    }
    return Object.fromEntries(updatedData);
  };

  /* __________ Database functions __________ */

  const updateProjectData = async () => {
    const updatedData = getUpdatedDataOnly();
    try {
      const { error } = await supabase
        .from("projects")
        .update(updatedData)
        .eq("id", projectData.id);

      if (error) throw error;
      else {
        getProjectData();
        toast.success("Les données ont bien été mises à jour");
      }
    } catch (error) {
      toast.error("Un problème est survenu, veuillez rééssayer plus tard");
      console.error(error);
    }
  };

  const deleteProject = async () => {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectData.id);
      if (error) throw error;
      else {
        setOpenConfirmDelete(false);
        navigate("/");
        toast.success("Le projet a bien été supprimée");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression du projet");
      console.error(error);
    }
  };

  /* ________________________________________ */

  /* ___________ Handle functions ___________ */

  /* --- Copy to clipboard function --- */
  const handleCopy = async () => {
    const contentToCopy = projectData.id;
    try {
      await navigator.clipboard.writeText(contentToCopy);
      toast.success("L'ID a bien été copié !");
    } catch (error) {
      console.error("Failed to copy: ", error);
      toast.error("Erreur lors de la copie, rééssayez plus tard !");
    }
  };

  const handleNameUpdate = () => {
    setModifyName(!modifyName);
  };

  const handleNameBlur = () => {
    if (!newData.name) {
      // Reset to original project name if user leaves the field empty
      setNewData({ ...newData, name: projectData.name });
    }
    setModifyName(!modifyName);
  };

  const handleNameChange = (e) => {
    if (e.target.value.length >= 30) {
      toast.error("Le nom du projet peut faire au maximum 30 caractères");
      return;
    }
    setNewData({ ...newData, name: e.target.value });
  };

  const handleSwitch = (value) => {
    setNewData({ ...newData, [value]: !newData[value] });
  };

  const handleGetNewPic = async () => {
    const newPicUrl = await axios
      .get("https://picsum.photos/1920/1080")
      .then((res) => {
        return res.request.responseURL;
      })
      .catch((err) => {
        console.error(err);
        toast.error("Impossible de récupérer une nouvelle image");
      });
    if (newPicUrl === "" || newPicUrl === null || newPicUrl === undefined) {
      toast.error(
        "Le service d'image est indisponible pour le moment. Veuillez réessayer plus tard"
      );
      return;
    }
    setNewData({ ...newData, picture: newPicUrl });
    setShowPic(true);
  };

  const handleDelete = () => {
    deleteProject();
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateProjectData();
  };

  /* --- Replace all data with original project data --- */
  const handleReset = () => {
    const resetValues = {};
    for (const data in newData) {
      if (data) {
        Object.assign(resetValues, { [data]: projectData[data] });
      }
    }
    setNewData(resetValues);
  };

  const handleDeleteClick = () => {
    setOpenConfirmDelete(true);
  };

  const handleCancelClick = () => {
    setOpenConfirmDelete(false);
  };

  const handleCloseUpdateModal = () => {
    if (openConfirmUpdate.closedSettings) {
      setOpenConfirmUpdate({ ...openConfirmUpdate, closedSettings: false });
      setOpenSettings(false);
    }
    if (openConfirmUpdate.changedSection !== "") {
      setContent(openConfirmUpdate.changedSection);
      setOpenConfirmUpdate({ ...openConfirmUpdate, changedSection: "" });
    }
  };

  const handleConfirmUpdate = (e) => {
    handleUpdate(e);
    handleCloseUpdateModal();
  };

  /* ________________________________________ */

  useEffect(() => {
    return () => haveGeneralSettingsBeenUpdated(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <form onSubmit={handleUpdate} className={styles.form}>
        {/* _____ Project ID _____ */}
        <div className={styles.item}>
          <div className={styles.label}>
            <label htmlFor="project-id">ID du projet</label>
            <TooltipIcon
              tooltip="Partagez cet ID avec les gens souhaitant rejoindre votre projet."
              top="0"
              left="100px"
              color="var(--action)"
            />
          </div>
          <div style={{ display: "inline", position: "relative" }}>
            <input
              disabled
              readOnly
              type="text"
              id="project-id"
              name="project-id"
              value={projectData.id}
              className={styles.input}
            />
            <IconButton
              onClick={handleCopy}
              sx={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                right: 0,
              }}
            >
              <ContentCopy sx={{ color: "button.main" }} />
            </IconButton>
          </div>
        </div>
        {/* _____ Project name _____ */}
        <div className={styles.item}>
          <label htmlFor="project-name">Nom du projet</label>
          <div style={{ display: "inline", position: "relative" }}>
            <input
              type="text"
              id="project-name"
              name="project-name"
              disabled={!modifyName}
              value={newData.name}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              className={[
                styles.input,
                modifyName ? styles.inputModify : null,
              ].join(" ")}
            />
            <IconButton
              onClick={handleNameUpdate}
              sx={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                right: 0,
              }}
            >
              <Edit sx={{ color: "button.main" }} />
            </IconButton>
          </div>
        </div>
        {/* _____ Project status _____ */}
        <div className={styles.item}>
          <div className={styles.label}>
            <p>Statut du projet</p>
            <TooltipIcon
              tooltip="Un projet inactif ne peut plus recevoir de demandes de PR."
              top="0"
              left="132px"
              color="var(--action)"
            />
          </div>
          <div>
            <FormControlLabel
              id="project-status"
              control={
                <Switch
                  checked={newData.status}
                  onChange={() => handleSwitch("status")}
                  name="status"
                />
              }
              label={newData.status ? "Actif" : "Inactif"}
              labelPlacement="end"
            />
          </div>
        </div>
        {/* _____ Project invitations _____ */}
        <div className={styles.item}>
          <div className={styles.label}>
            <p>Invitations ouvertes</p>
            <TooltipIcon
              tooltip="Décidez si vous souhaitez recevoir des demandes pour rejoindre votre projet."
              top="0"
              left="162px"
              color="var(--action)"
            />
          </div>
          <div>
            <FormControlLabel
              id="project-invites"
              control={
                <Switch
                  checked={newData.invitation}
                  onChange={() => handleSwitch("invitation")}
                  name="invitation"
                />
              }
              label={newData.invitation ? "Oui" : "Non"}
              labelPlacement="end"
            />
          </div>
        </div>
        {/* _____ Project picture _____ */}
        <div className={styles.item}>
          <div className={styles.label}>
            <p>Image du projet</p>
            <IconButton
              onClick={() => setShowPic(true)}
              sx={{
                position: "absolute",
                top: 0,
                left: "130px",
                "&.MuiIconButton-root": { padding: 0, paddingLeft: "0.5rem" },
              }}
            >
              <Visibility fontSize="small" sx={{ color: "button.main" }} />
            </IconButton>
            <Dialog
              open={showPic}
              onClose={() => setShowPic(false)}
              aria-labelledby="project-picture"
              aria-describedby="project-picture-display"
            >
              <img src={newData.picture} alt="project-background" />
            </Dialog>
          </div>
          <div>
            <Button
              id="project-pic"
              onClick={handleGetNewPic}
              size="small"
              variant="contained"
              sx={{
                bgcolor: "button.main",
                textTransform: "none",
                width: "230px",
                [theme.breakpoints.down("sm")]: {
                  width: "100%",
                },
              }}
            >
              Générer une nouvelle image
            </Button>
          </div>
        </div>
        {/* _____ Project delete _____ */}
        <div className={styles.item}>
          <div className={styles.label}>
            <p>Supprimer le projet</p>
            <TooltipIcon
              tooltip="Supprimez votre projet avec toutes les demandes de PR qu'il contient."
              top="0"
              left="160px"
              color="var(--action)"
            />
          </div>
          <div>
            <Button
              id="delete-project"
              onClick={handleDeleteClick}
              size="small"
              variant="contained"
              sx={{
                bgcolor: "button.secondary",
                textTransform: "none",
                width: "230px",
                "&:hover": { bgcolor: "button.hover" },
                [theme.breakpoints.down("sm")]: {
                  width: "100%",
                },
              }}
            >
              Supprimer
            </Button>
          </div>
        </div>
        {/* _____ Save + Reset buttons _____ */}
        <div className={styles.buttons}>
          <Button
            type="submit"
            disabled={!updated}
            variant="contained"
            sx={{ bgcolor: "button.main", textTransform: "none" }}
          >
            Enregistrer
          </Button>

          <Button
            disabled={!updated}
            onClick={handleReset}
            sx={{
              color: "button.main",
              textTransform: "none",
              border: "1px solid var(--action)",
              "&:disabled": {
                border: "none",
              },
            }}
          >
            Réinitialiser
          </Button>
        </div>

        {openConfirmDelete && (
          <ConfirmationModal
            handleLeftButtonClick={handleCancelClick}
            handleRightButtonClick={handleDelete}
            title="Le projet sera définitivement supprimer sans aucune possibilité de récupération, êtes-vous sûr ?"
            textButtonLeft="Annuler"
            textButtonRight="Supprimer"
          />
        )}
      </form>

      {(openConfirmUpdate.closedSettings ||
        openConfirmUpdate.changedSection !== "") && (
        <ConfirmationModal
          handleLeftButtonClick={handleConfirmUpdate}
          handleRightButtonClick={handleCloseUpdateModal}
          title="Voulez-vous sauvegarder les changements avant de quitter ?"
          textButtonLeft="Sauvegarder"
          textButtonRight="Quitter"
        />
      )}
    </>
  );
}

GeneralSettings.propTypes = {
  projectData: PropTypes.shape({
    created_at: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    invitation: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
    status: PropTypes.bool.isRequired,
  }).isRequired,
  getProjectData: PropTypes.func.isRequired,
  haveGeneralSettingsBeenUpdated: PropTypes.func.isRequired,
  openConfirmUpdate: PropTypes.shape({
    closedSettings: PropTypes.bool.isRequired,
    changedSection: PropTypes.string.isRequired,
  }).isRequired,
  setOpenConfirmUpdate: PropTypes.func.isRequired,
  setOpenSettings: PropTypes.func.isRequired,
  setContent: PropTypes.func.isRequired,
};
