import PropTypes from "prop-types";
import styles from "./NotificationCard.module.css";

function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  switch (true) {
    case diffSeconds < 2:
      return `il y a ${diffSeconds} seconde`;
    case diffSeconds < 60:
      return `il y a ${diffSeconds} secondes`;
    case diffMinutes < 2:
      return `il y a ${diffMinutes} minute`;
    case diffMinutes < 60:
      return `il y a ${diffMinutes} minutes`;
    case diffHours < 2:
      return `il y a ${diffHours} heure`;
    case diffHours < 24:
      return `il y a ${diffHours} heures`;
    case diffDays < 2:
      return `il y a ${diffDays} jour`;
    default:
      return `il y a ${diffDays} jours`;
  }
}

export default function NotificationCard({ notification }) {
  const getStatusColor = () => {
    if (notification.type === 1) {
      return styles.validation_color;
    }
    if (notification.type === 2) {
      return styles.cancel_color;
    }
    return null;
  };

  // on applique une bulle de notification s'il y a une nouvelle notification

  const getNewBadge = () => {
    if (notification.notification_user[0].unread === true) {
      return `${styles.new_badge}`;
    }
    if (notification.notification_user[0].unread === false) {
      return `${styles.display_none_class}`;
    }
    return ""; // Retourne une chaîne vide si la condition n'est pas remplie
  };

  const getTextClass = () => {
    if (notification.notification_user[0].unread === true) {
      return `${styles.boldIfUnread}`;
    }
    return "";
  };

  const formattedDate = formatRelativeTime(notification.created_at);

  return (
    <div className={styles.notificationcard_container}>
      <div className={`${styles.status_color} ${getStatusColor() || ""}`} />
      <div className={styles.is_new_badge}>
        <div className={`${getNewBadge()}`} />
      </div>
      <div className={styles.contentNotif}>
        <div className={`${getTextClass()} ${styles.text_section}`}>
          <p>{notification.message}</p>
        </div>
        <div className={`${getTextClass()} ${styles.date_section}`}>
          <p>{formattedDate}</p>
        </div>
      </div>
    </div>
  );
}

NotificationCard.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    notification_user: PropTypes.arrayOf(
      PropTypes.shape({
        unread: PropTypes.bool.isRequired,
      })
    ).isRequired,
  }).isRequired,
};
