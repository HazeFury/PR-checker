import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { CircularProgress } from "@mui/material";
import NotificationCard from "./NotificationCard";
import supabase from "../../../../services/client";
import styles from "./NotificationBox.module.css";
import refreshContext from "../../../../contexts/RefreshContext";

export default function NotificationBox({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshData, setRefreshData } = useContext(refreshContext);

  const handleRefresh = () => {
    setRefreshData(!refreshData);
  };

  // Fetch all the notifications that the user are eligible to see
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
      setLoading(false);
    }
  }
  // mark notifications as read when unmounting the component
  async function notificationsAreRead() {
    const { error } = await supabase
      .from("notification_user")
      .update({ unread: false })
      .eq("user_uuid", userId);

    handleRefresh();

    if (error) {
      console.error("Les notifications n'ont pas pu êtres marqués comme lu");
    }
  }

  useEffect(() => {
    getNotifications();
    return () => {
      notificationsAreRead();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.notifications_container}>
      {!notifications || notifications.length === 0 ? (
        <div className={styles.nodata}>
          {loading ? (
            <CircularProgress size={60} thickness={2} />
          ) : (
            <p>Vous n'avez actuellement aucune notification.</p>
          )}
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
