import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import supabase from "../../../../services/client";

export default function ModalDescriptionPR({ open, onClose }) {
  const [description, setDescriptions] = useState([]);

  const handleModalCloseCreate = () => {
    onClose(); // Appel de la fonction onClose pour fermer la modal
  };

  useEffect(() => {
    async function fetchDescriptions() {
      try {
        // Récupérer les données de la table pr_request (description)
        const { data, error } = await supabase
          .from("pr_request_id")
          .select("description")
          .eq("id", "pr_request_id")
          .single();

        if (error) {
          throw error;
        }

        // Mettre à jour l'état avec les descriptions récupérées
        if (data) {
          setDescriptions(data.description);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des descriptions:",
          error.message
        );
      }
    }

    // Appeler la fonction pour récupérer les descriptions lorsque le composant est monté
    fetchDescriptions();
  }, []); // Le tableau vide en tant que dépendance signifie que ce code ne s'exécute qu'une seule fois après le montage initial du composant

  const style = {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 690,
    height: 405,
    backgroundColor: "#292929",
    borderRadius: "0.625rem",
    fontFamily: "Montserrat",
    boxShadow: 24,
    padding: 4,
  };

  return (
    <Modal open={open} onClose={handleModalCloseCreate}>
      <Box sx={style}>
        <IconButton
          style={{
            position: "absolute",
            top: "0.3rem",
            right: "0.3rem",
            backgroundColor: "#A82B2B",
            width: "2.3rem",
            height: "2.5rem",
            borderRadius: "0px 7px 0px 10px",
          }}
          onClick={handleModalCloseCreate}
          aria-label="close"
        >
          <CloseIcon style={{ color: "white" }} />
        </IconButton>
        <h1>Descriptions des PR</h1>
        <p>{description}</p>
      </Box>
    </Modal>
  );
}

ModalDescriptionPR.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
