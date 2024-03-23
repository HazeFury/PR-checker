import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import NotificationCard from "./NotificationCard";
import supabase from "../../../../services/client";
import styles from "./NotificationBox.module.css";

export default function NotificationBox({ userId }) {
  const [notifications, setNotifications] = useState([]);

  // Fetch all the notifications that the user are eligible to see
  useEffect(() => {
    async function getNotifications() {
      if (userId !== null) {
        const { data: notificationsData } = await supabase
          .from("notification")
          .select("*, notification_user!inner(*)")
          .match({
            "notification_user.user_uuid": userId,
          })
          .order("created_at", { ascending: false }) // Tri par date, du plus récent au plus ancien
          .range(0, 19);

        setNotifications(notificationsData);
      }
    }
    getNotifications();
  }, [userId]);

  return (
    <div className={styles.notifications_container}>
      {!notifications || notifications.length === 0 ? (
        <div className={styles.nodata}>
          <p>Vous n'avez actuellement aucune notification.</p>
        </div>
      ) : null}
      {notifications
        .slice() // Create a copy of the array to avoid mutating the original array
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Sort the notifications by created_at in descending order
        .map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
    </div>
  );
}

NotificationBox.propTypes = {
  userId: PropTypes.string,
};

NotificationBox.defaultProps = {
  userId: "",
};
