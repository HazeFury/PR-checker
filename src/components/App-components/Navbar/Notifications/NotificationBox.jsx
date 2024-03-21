import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import NotificationCard from "./NotificationCard";
import supabase from "../../../../services/client";
import styles from "./NotificationBox.module.css";

export default function NotificationBox() {
  const [notifications, setNotifications] = useState([]);

  const [userId] = useOutletContext();

  useEffect(() => {
    async function getNotifications() {
      if (userId !== null) {
        const { data: notificationsData, error } = await supabase
          .from("notification")
          .select("*, notification_user!inner(*)")
          .match({
            "notification_user.user_uuid": userId,
          });

        if (error) {
          console.error(
            "Erreur lors de la récupération des notifications :",
            error.message
          );
        } else {
          console.info(
            "Notifications récupérées avec succès :",
            notificationsData
          );
          setNotifications(notificationsData);
        }
      }
    }
    getNotifications();
  }, [userId]);

  return (
    <div className={styles.notifications_container}>
      <div>
        {!notifications || notifications.length === 0 ? (
          <div className={styles.nodata}>
            <p>Vous n'avez actuellement aucune notification.</p>
          </div>
        ) : null}
        {notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
}
