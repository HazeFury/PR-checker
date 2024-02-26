import { Box, Button } from "@mui/material";
import PropTypes from "prop-types";

import styles from "./ConfirmationModal.module.css";

export default function ConfirmationModal({
  handleCloseModals,
  handleOpenRequestModal,
}) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 445,
    height: 265,
    bgcolor: "#292929",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    fontSize: "20px",
    textAlign: "center",
  };

  const buttonStyle = {
    bgcolor: "#A82B2B",
    "&:hover": {
      bgcolor: "#8c2222", // Changez la couleur de fond au survol
    },
  };
  return (
    <div className={styles.backdrop}>
      <Box sx={style}>
        <p>
          Voulez-vous vraiment <br />
          quitter l'enregistrement ?
        </p>
        <div className={styles.buttonContainer}>
          <Button variant="contained" onClick={handleOpenRequestModal}>
            Revenir à mon enregistrement
          </Button>
          <Button
            variant="contained"
            sx={buttonStyle}
            onClick={handleCloseModals}
          >
            Confirmer et quitter
          </Button>
        </div>
      </Box>
    </div>
  );
}
ConfirmationModal.propTypes = {
  handleCloseModals: PropTypes.func.isRequired,
  handleOpenRequestModal: PropTypes.func.isRequired,
};
