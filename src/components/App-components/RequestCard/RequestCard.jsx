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
      return styles.resquestRejected;
    case 6:
      return styles.requestValidated;
    default:
      return styles.defaultColor;
  }
}

function statusName(status) {
  switch (status) {
    case 1:
      return "En attente de review";
    case 2:
      return "En cours de review";
    case 3:
      return "En attente de correctifs";
    case 4:
      return "Correctifs faits";
    case 5:
      return "Demande rejetée";
    case 6:
      return "Demande validée";
    default:
      return styles.defaultColor;
  }
}

export default function RequestCard({ request, handleOpenModalAboutRequest }) {
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
        <p className={styles.status_name}>{statusName(request.status)}</p>
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
            <b> Marco</b>
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
            buttonText="Administrer"
            textItem1="Modifier"
            textItem2="Supprimer"
            handleOpenModalAboutRequest={() => {
              handleOpenModalAboutRequest(request.id);
            }}
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
  request: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    github: PropTypes.string.isRequired,
    trello: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  handleOpenModalAboutRequest: PropTypes.func.isRequired,
};
