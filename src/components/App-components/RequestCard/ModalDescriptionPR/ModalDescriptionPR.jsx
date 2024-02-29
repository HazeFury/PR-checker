import PropTypes from "prop-types";
import { Box, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./ModalDescriptionPR.module.css";

export default function ModalDescriptionPR({ open, onClose, request }) {
  const handleModalCloseCreate = () => {
    onClose();
  };

  const style = {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1007,
    height: 368,
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
        <div className={styles.container}>
          <h2 className={styles.moreInfos}>Plus d'infos</h2>
          <h3 className={styles.descriptionTitle}>Description de l'US</h3>
          <p className={styles.descriptionText}>{request.description}</p>
        </div>
      </Box>
    </Modal>
  );
}

ModalDescriptionPR.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  request: PropTypes.shape({
    description: PropTypes.string.isRequired,
  }).isRequired,
};
