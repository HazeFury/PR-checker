import PropTypes from "prop-types";
// import { useState } from "react";

import styles from "./RequestCard.module.css";
// Icons
import info from "../../../assets/info.svg";
import trello from "../../../assets/trello.svg";
import github from "../../../assets/github.svg";
import ManageRequestButton from "../../UI-components/Buttons/ManageRequestButton";

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
export default function RequestCard({ request }) {
  // Function to open modal with infos on PR
  /*
  const [modalOpen, setModalOpen] = useState(false);
  const handleButtonClick = () => {
    setModalOpen(true);
  };
  */
  return (
    <div className={styles.card}>
      <ul className={styles.ul_box}>
        <div className={statusColor(request.status)}>
          <div className={styles.statusBlock}>
            <li className={styles.pr_id}>#{request.id}</li>
            <li className={styles.status}>{statusName(request.status)}</li>
          </div>
        </div>
        <div className={styles.informations}>
          <div className={styles.infos}>
            <li className={styles.li_style}>
              Ouvert par : <b>Marco</b>
            </li>
            <li className={styles.li_style}>
              Nom de la PR :<b> {request.title}</b>
            </li>
          </div>
          <div className={styles.logos}>
            <button
              type="button" /* 
                onClick={handleButtonClick}
            */
            >
              <img src={info} alt="pr-description" />
            </button>

            <button type="button">
              <a href={request.github} target="_blank" rel="noreferrer">
                <img src={github} alt="githublink" />
              </a>
            </button>
            <button type="button">
              <a href={request.trello} target="_blank" rel="noreferrer">
                <img src={trello} alt="trellolink" />
              </a>
            </button>
          </div>
        </div>
        <ManageRequestButton
          buttonText="Administrer"
          textItem1="Modifier"
          textItem2="Supprimer"
        />
      </ul>
    </div>
  );
}

RequestCard.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    github: PropTypes.string.isRequired,
    trello: PropTypes.string.isRequired,
  }).isRequired,
};
