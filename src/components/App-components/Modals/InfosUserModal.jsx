import { Box, IconButton, Modal } from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./InfosUserModal.module.css";

export default function InfosUserModal({
  openModalUserInfos,
  onCloseModalUserInfos,
  userInfos,
}) {
  const style = {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: {
      sm: "400px",
      md: "670px",
      lg: "690px",
      xl: "710px",
    },
    height: 405,
    backgroundColor: "#292929",
    borderRadius: "0.625rem",
    fontFamily: "Montserrat",
    boxShadow: 24,
    padding: 4,
  };

  const handleModalClose = () => {
    onCloseModalUserInfos();
  };
  return (
    <Modal open={openModalUserInfos} onClose={handleModalClose}>
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
          onClick={handleModalClose}
          aria-label="close"
        >
          {" "}
          <CloseIcon style={{ color: "white" }} />
        </IconButton>

        <div className={styles.userInfosBlock}>
          <h2>Informations de l'utilisateur</h2>
          <div className={styles.infos}>
            <p>
              Prénom : <span>{userInfos.first_name}</span>
            </p>
            <p>
              Nom : <span>{userInfos.last_name}</span>{" "}
            </p>
            <p>
              Email : <span>{userInfos.email}</span>{" "}
            </p>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
InfosUserModal.propTypes = {
  openModalUserInfos: PropTypes.bool.isRequired,
  onCloseModalUserInfos: PropTypes.func.isRequired,
  userInfos: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};
