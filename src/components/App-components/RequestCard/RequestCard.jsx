import PropTypes from "prop-types";

import { useState } from "react";

import { Divider, IconButton, Stack } from "@mui/material";
import styles from "./RequestCard.module.css";
// Icons
import info from "../../../assets/info.svg";
import trello from "../../../assets/trello.svg";
import github from "../../../assets/github.svg";

import ModalDescriptionPR from "./ModalDescriptionPR/ModalDescriptionPR";
import ManageRequestButton from "../../UI-components/Buttons/ManageRequestButton";
import useScreenSize from "../../../hooks/useScreenSize";

const statusNames = [
  { name: "En attente de review", value: 1 },
  { name: "En cours de review", value: 2 },
  { name: "En attente de correctifs", value: 3 },
  { name: "Correctifs faits", value: 4 },
  { name: "Demande rejetée", value: 5 },
  { name: "Demande validée", value: 6 },
];

// Function to assign a color based on status
function statusColor(status) {
  switch (status) {
    case 1:
      return styles.waitingReview;
    case 2:
      return styles.inProgress;
    case 3:
      return styles.waitingCorrection;
    case 4:
      return styles.correctionDone;
    case 5:
      return styles.requestRejected;
    case 6:
      return styles.requestValidated;
    default:
      return styles.defaultColor;
  }
}

function nameStatus(status) {
  switch (status) {
    case 1:
      return statusNames[0].name;
    case 2:
      return statusNames[1].name;
    case 3:
      return statusNames[2].name;
    case 4:
      return statusNames[3].name;
    case 5:
      return statusNames[4].name;
    case 6:
      return statusNames[5].name;
    default:
      return "Statut inderterminé";
  }
}
export default function RequestCard({
  userRole,
  request,
  handleOpenModalAboutRequest,
  handleOpenConfirmationModal,
}) {
  // Function to open modal with infos on PR
  const [modalOpen, setModalOpen] = useState(false);
  const handleButtonClick = () => {
    setModalOpen(true);
  };

  const handleCloseDescriptionPRModal = () => {
    setModalOpen(false);
  };

  const screenSize = useScreenSize();

  const formattedDate = new Date(request.created_at).toLocaleString();

  return (
    <Stack
      direction={screenSize < 767 ? "column" : "row"}
      className={styles.card}
      justifyContent="space-between"
    >
      <Stack
        className={[styles.status, statusColor(request.status)].join(" ")}
        direction="row"
        justifyContent="space-evenly"
        alignItems="center"
        divider={
          <Divider
            orientation="vertical"
            flexItem
            variant="middle"
            sx={{ bgcolor: "#e8e8e8", width: "2px" }}
          />
        }
      >
        <p className={styles.status_pr_id}>#{request.id}</p>
        <p className={styles.status_name}>{nameStatus(request.status)}</p>
      </Stack>
      <Stack
        className={styles.pr}
        direction={screenSize <= 1024 ? "column" : "row"}
      >
        <Stack className={styles.infos} direction="row">
          <p>
            PR :{screenSize < 1200 && screenSize > 1024 && <br />}
            <b> {request.title}</b>
          </p>
          <p>
            Par :{screenSize < 1200 && screenSize > 1024 && <br />}{" "}
            <b> {request.opened_by}</b>
          </p>
          {screenSize > 1024 ? (
            <p>
              Le :{screenSize < 1200 && screenSize > 1024 && <br />}{" "}
              <b> {formattedDate}</b>
            </p>
          ) : null}
        </Stack>
        <Stack className={styles.buttons} direction="row">
          <IconButton onClick={handleButtonClick}>
            <img src={info} alt="info-button" />
          </IconButton>
          <IconButton className={styles.buttons_link}>
            <a href={request.github} target="_blank" rel="noreferrer">
              <img src={github} alt="github-link" />
            </a>
          </IconButton>
          <IconButton className={styles.buttons_link}>
            <a href={request.trello} target="_blank" rel="noreferrer">
              <img src={trello} alt="trello-link" />
            </a>
          </IconButton>
          <ManageRequestButton
            request={request}
            statusNames={statusNames}
            userRole={userRole}
            handleOpenModalAboutRequest={() => {
              handleOpenModalAboutRequest(request.id);
            }}
            handleOpenConfirmationModal={() => {
              handleOpenConfirmationModal();
            }}
            statusColor={statusColor}
          />
        </Stack>
        <ModalDescriptionPR
          openModalDescription={modalOpen}
          onCloseModalDescription={handleCloseDescriptionPRModal}
          request={request}
        />
      </Stack>
    </Stack>
  );
}

RequestCard.propTypes = {
  userRole: PropTypes.string.isRequired,
  request: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    github: PropTypes.string.isRequired,
    trello: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    user_uuid: PropTypes.string.isRequired,
    opened_by: PropTypes.string.isRequired,
  }).isRequired,
  handleOpenModalAboutRequest: PropTypes.func.isRequired,
  handleOpenConfirmationModal: PropTypes.func.isRequired,
};
