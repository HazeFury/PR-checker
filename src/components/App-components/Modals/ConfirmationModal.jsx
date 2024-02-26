import { Box, Button } from "@mui/material";
import PropTypes from "prop-types";

import styles from "./ConfirmationModal.module.css";

export default function ConfirmationModal({
  handleCloseModals,
  handleOpenRequestModal,
  title,
  textButtonLeft,
  textButtonRight,
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

  const buttonLeftStyle = {
    bgcolor: "#A82B2B",
    width: "350px",

    "&:hover": {
      bgcolor: "#8c2222",
    },
  };
  const buttonRigthStyle = {
    width: "350px",
  };
  return (
    <div className={styles.backdrop}>
      <Box sx={style}>
        <p>{title}</p>
        <div className={styles.buttonContainer}>
          <Button
            variant="contained"
            sx={buttonRigthStyle}
            onClick={handleOpenRequestModal}
          >
            {textButtonLeft}
          </Button>
          <Button
            variant="contained"
            sx={buttonLeftStyle}
            onClick={handleCloseModals}
          >
            {textButtonRight}
          </Button>
        </div>
      </Box>
    </div>
  );
}
ConfirmationModal.propTypes = {
  title: PropTypes.string.isRequired,
  textButtonLeft: PropTypes.string.isRequired,
  textButtonRight: PropTypes.string.isRequired,
  handleCloseModals: PropTypes.func.isRequired,
  handleOpenRequestModal: PropTypes.func.isRequired,
};
