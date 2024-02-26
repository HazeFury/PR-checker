import PropTypes from "prop-types";
import { Box, Modal, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ModalDescriptionPR({ open, onClose }) {
  const handleModalCloseCreate = () => {
    onClose(); // Appel de la fonction onClose pour fermer la modal
  };

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
      </Box>
    </Modal>
  );
}

ModalDescriptionPR.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
