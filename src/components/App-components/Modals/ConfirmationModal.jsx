import { Box, Button } from "@mui/material";
import { useTheme } from "@emotion/react";
import PropTypes from "prop-types";
import styles from "./ConfirmationModal.module.css";

export default function ConfirmationModal({
  handleLeftButtonClick,
  handleRightButtonClick,
  title,
  textButtonLeft,
  textButtonRight,
}) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: 265,
    bgcolor: "#292929",
    borderRadius: "10px",
    boxShadow: 24,
    p: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
    fontSize: "20px",
    textAlign: "center",
    width: {
      xs: "300px",
      sm: "320px",
      md: "430px",
      lg: "480px",
    },
  };
  const theme = useTheme();

  return (
    <div className={styles.backdrop}>
      <Box sx={style} className={styles.modal}>
        <p>{title}</p>
        <div className={styles.buttonContainer}>
          <Button
            className={styles.buttonStyle}
            variant="contained"
            sx={{
              backgroundColor: theme.palette.button.main,
              width: { xs: "350px" },
            }}
            onClick={handleLeftButtonClick}
          >
            {textButtonLeft}
          </Button>
          <Button
            className={styles.buttonStyle}
            variant="contained"
            sx={{
              width: { xs: "350px" },
              backgroundColor: theme.palette.button.secondary,
              "&:hover": {
                backgroundColor: theme.palette.button.hover,
              },
            }}
            onClick={handleRightButtonClick}
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
  handleLeftButtonClick: PropTypes.func.isRequired,
  handleRightButtonClick: PropTypes.func.isRequired,
};
