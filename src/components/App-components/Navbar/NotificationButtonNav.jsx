import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import ListItemButton from "@mui/material/ListItemButton";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationBox from "./Notifications/NotificationBox";
import styles from "./NotificationButtonNav.module.css";

export default function NotificationButtonNav({ notificationUser }) {
  const [openNotificationBox, setOpenNotificationBox] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const location = useLocation();
  const { uuid } = useParams();

  useEffect(() => {
    // Check if notificationUser est un tableau et à une methode filtre
    if (
      Array.isArray(notificationUser) &&
      typeof notificationUser.filter === "function"
    ) {
      // Calcule le nombre de notifications non lues
      const unreadCount = notificationUser.filter(
        (notif) => notif.unread
      ).length;
      setUnreadNotificationsCount(unreadCount);
    }
  }, [notificationUser]);

  const handleNotification = () => {
    setOpenNotificationBox(!openNotificationBox);
    setUnreadNotificationsCount(0); // Marque toutes les notifications comme lues quand l'user clique
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

NotificationButtonNav.propTypes = {
  notificationUser: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      unread: PropTypes.bool.isRequired,
    })
  ).isRequired,
};
