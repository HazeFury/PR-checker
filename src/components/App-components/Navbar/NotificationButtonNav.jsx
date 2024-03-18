import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationBox from "./Notifications/NotificationBox";
import styles from "./NotificationButtonNav.module.css";

export default function NotificationButtonNav() {
  const [openNotificationBox, setOpenNotificationBox] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const location = useLocation();
  const { uuid } = useParams();

  useEffect(() => {
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
    // Calculate the count of unread notifications whenever notifications change
    const unreadCount = notifications.filter(
      (notification) => notification.unread
    ).length;
    setUnreadNotificationsCount(unreadCount);
  }, []);

  const handleNotification = () => {
    setOpenNotificationBox(!openNotificationBox);
    setUnreadNotificationsCount(0); // Mark all notifications as read when the notification icon is clicked
  };

  const isOnPRList = location.pathname.startsWith("/project/") && uuid;
  const renderExtraButton = () => {
    if (isOnPRList) {
      return (
        <>
          <div
            className={
              openNotificationBox
                ? `${styles.notification_box_position_godown}`
                : `${styles.notification_box_position_goup}`
            }
          >
            {openNotificationBox && <NotificationBox />}
          </div>
          <div className={styles.header_box}>
            <div className={styles.header_notification}>
              <ListItemButton
                onClick={handleNotification}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 50,
                  width: 60,
                }}
              >
                <NotificationsNoneOutlinedIcon
                  sx={{ color: "white", scale: "1.8" }}
                />
                {unreadNotificationsCount > 0 && (
                  <div className={styles.notification_bubble}>
                    {unreadNotificationsCount}
                  </div>
                )}
              </ListItemButton>
            </div>
          </div>
        </>
      );
    }
    return null;
  };

  return <div>{renderExtraButton()}</div>;
}
