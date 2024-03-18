import NotificationCard from "./NotificationCard";
import styles from "./NotificationBox.module.css";

export default function NotificationBox() {
  const notifications = [
    {
      id: 1,
      text: "La PR US22_Register a été validée",
      type: "validation",
      created_at: "1H",
      unread: 0,
    },
    {
      id: 2,
      text: "La PR US32_Authentification est en attente de correction",
      type: "correction",
      created_at: "10H",
      unread: 0,
    },
    {
      id: 3,
      text: "La PR US12_ProjectCard a été rejetée",
      type: "annulation",
      created_at: "1j",
      unread: 1,
    },
    {
      id: 4,
      text: "La PR US12_ProjectCard a été rejetée",
      type: "annulation",
      created_at: "1j",
      unread: 1,
    },
  ];

  return (
    <div className={styles.notifications_container}>
      <div>
        {!notifications || notifications.length === 0 ? (
          <div className={styles.nodata}>
            <p>Vous n'avez actuellement aucune notification.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
            />
          ))
        )}
      </div>
    </div>
  );
}
