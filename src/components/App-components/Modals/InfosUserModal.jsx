import { Box, IconButton, Modal } from "@mui/material";
import PropTypes from "prop-types";

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
    width: 1007,
    height: 368,
    backgroundColor: "#292929",
    borderRadius: "0.625rem",
    fontFamily: "Montserrat",
    boxShadow: 24,
    padding: 4,
  };

  const email = userInfos ? userInfos[0] : "";
  const firstName = userInfos ? userInfos[1] : "";
  const lastName = userInfos ? userInfos[2] : "";

  const handleModalCloseCreate = () => {
    onCloseModalUserInfos();
  };
  return (
    <Modal open={openModalUserInfos} onClose={handleModalCloseCreate}>
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
          {" "}
        </IconButton>
        <div>Email: {email}</div>
        <div>First Name: {firstName}</div>
        <div>Last Name: {lastName}</div>
      </Box>
    </Modal>
  );
}
InfosUserModal.propTypes = {
  openModalUserInfos: PropTypes.bool.isRequired,
  onCloseModalUserInfos: PropTypes.func.isRequired,
  userInfos: PropTypes.arrayOf.isRequired,
};
