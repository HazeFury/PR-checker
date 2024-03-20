import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import NotificationCard from "./NotificationCard";
import supabase from "../../../../services/client";
import styles from "./NotificationBox.module.css";

export default function NotificationBox() {
  const [notifications, setNotifications] = useState([]);

  const { userId } = useOutletContext();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Récupérer les notifications de l'utilisateur actuel depuis le backend
        const { data: notificationsData, error } = await supabase
          .from("notification")
          .select("*")
          .eq("user_uuid", userId)
          .order("created_at", { ascending: false });

        if (error) {
          throw new Error(
            "Erreur lors de la récupération des notifications : "
          );
        }

        // Mettre à jour l'état avec les nouvelles notifications récupérées
        setNotifications(notificationsData);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchNotifications();
  });
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
