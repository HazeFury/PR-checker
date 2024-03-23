import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import ListItemButton from "@mui/material/ListItemButton";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationBox from "./Notifications/NotificationBox";
import supabase from "../../../services/client";
import styles from "./NotificationButtonNav.module.css";

export default function NotificationButtonNav({
  openNotificationBox,
  handleOpenNotification,
  handleCloseNotification,
  userId,
}) {
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const location = useLocation();
  const { uuid } = useParams();

  useEffect(() => {
    async function fetchNotifications() {
      if (userId !== null) {
        try {
          const { data, error } = await supabase
            .from("notification_user")
            .select("*")
            .eq("user_uuid", userId); // Assurez-vous d'avoir userId défini

          if (error) {
            throw error;
          }

          if (Array.isArray(data)) {
            const unreadCount = data.filter((notif) => notif.unread).length;
            setUnreadNotificationsCount(unreadCount);
          }
        } catch (error) {
          console.error("Error fetching notifications:");
        }
      }
    }

    fetchNotifications();
  }, [userId]);

  const handleNotificationClose = async () => {
    try {
      // Met à jour la base de données pour marquer toutes les notifications comme lues
      await supabase
        .from("notification_user")
        .update({ unread: false })
        .eq("user_uuid", userId);

      // Met à jour l'état pour gérer les notifications
      setUnreadNotificationsCount(0);

      // Appelle la fonction passer en props de NavBar pour ouvrir
      handleCloseNotification();
    } catch (error) {
      console.error(error);
    }
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
            {openNotificationBox && <NotificationBox userId={userId} />}
          </div>
          <div className={styles.header_box}>
            <div className={styles.header_notification}>
              <ListItemButton
                onClick={
                  openNotificationBox
                    ? handleNotificationClose
                    : handleOpenNotification
                }
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
  openNotificationBox: PropTypes.bool.isRequired,
  handleOpenNotification: PropTypes.func.isRequired,
  handleCloseNotification: PropTypes.func.isRequired,
  userId: PropTypes.string,
};

NotificationButtonNav.defaultProps = {
  userId: "",
};
