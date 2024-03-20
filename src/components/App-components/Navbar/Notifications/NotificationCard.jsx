import PropTypes from "prop-types";
import styles from "./NotificationCard.module.css";

export default function NotificationCard({ notification }) {
  // on applique une couleur en fonction de la nature de la notification
  const getStatusColor = () => {
    if (notification.type === "validation") {
      return styles.validation_color;
    }
    if (notification.type === "annulation") {
      return styles.cancel_color;
    }
    if (notification.type === "correction") {
      return styles.correction_color;
    }
    return null;
  };

  const formattedDate = new Date(notification.created_at).toLocaleString();

  return (
    <div className={styles.notificationcard_container}>
      <div className={`${styles.status_color} ${getStatusColor() || ""}`} />

      <div className={styles.contentNotif}>
        <div className={styles.text_section}>
          <p>{notification.message}</p>
        </div>
        <div className={styles.date_section}>
          <p>Il y a {formattedDate}</p>
        </div>
      </div>
    </div>
  );
}

NotificationCard.propTypes = {
  notification: PropTypes.shape({
    type: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
};
