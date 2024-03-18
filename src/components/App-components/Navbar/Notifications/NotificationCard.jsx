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

  // on applique une bulle de notification s'il y a une nouvelle notification
  const getNewBadge = () => {
    if (notification.unread === 0) {
      return styles.new_badge;
    }
    if (notification.unread === 1) {
      return styles.display_none_class;
    }
    return null;
  };

  const getTextClass = () => {
    if (notification.unread === 0) {
      return styles.boldIfUnread;
    }
    return "";
  };

  return (
    <div className={styles.notificationcard_container}>
      <div className={`${styles.status_color} ${getStatusColor() || ""}`} />
      <div className={styles.is_new_badge}>
        <div className={`${getNewBadge()}`} />
      </div>
      <div className={styles.contentNotif}>
        <div className={`${getTextClass()} ${styles.text_section}`}>
          <p>{notification.text}</p>
        </div>
        <div className={`${getTextClass()} ${styles.date_section}`}>
          <p>Il y a {notification.created_at}</p>
        </div>
      </div>
    </div>
  );
}

NotificationCard.propTypes = {
  notification: PropTypes.shape({
    type: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    unread: PropTypes.bool.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
};
