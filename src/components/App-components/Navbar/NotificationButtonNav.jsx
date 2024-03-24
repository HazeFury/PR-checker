import { useState, useEffect, useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import ListItemButton from "@mui/material/ListItemButton";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationBox from "./Notifications/NotificationBox";
import supabase from "../../../services/client";
import UserContext from "../../../contexts/UserContext";
import refreshContext from "../../../contexts/RefreshContext";
import styles from "./NotificationButtonNav.module.css";

export default function NotificationButtonNav({
  openNotificationBox,
  handleOpenNotification,
  handleCloseNotification,
  userId,
}) {
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const location = useLocation();
  const { userRole } = useContext(UserContext);
  const { refreshData } = useContext(refreshContext);

  const { uuid } = useParams();

  /* --- Function to get the number of notifications unread to display in the badge --- */
  useEffect(() => {
    async function fetchNotifications() {
      if (userId !== null) {
        try {
          const { data, error } = await supabase
            .from("notification_user")
            .select("count")
            .match({
              user_uuid: userId,
              unread: true,
            });
          setUnreadNotificationsCount(data[0].count);

          if (error) {
            throw error;
          }
        } catch (error) {
          console.error("Error fetching notifications:");
        }
      }
    }

    fetchNotifications();
  }, [userId, refreshData]);

  const handleNotificationClose = async () => {
    handleCloseNotification();
  };

  // Button are visible only if you are contributor and on the project page
  const isOnPRList =
    location.pathname.startsWith("/project/") &&
    uuid &&
    userRole === "contributor";

  // Button to open the notifications list
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
