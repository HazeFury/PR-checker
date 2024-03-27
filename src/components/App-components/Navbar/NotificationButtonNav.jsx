import { useState, useEffect, useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Badge, IconButton } from "@mui/material";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationBox from "./Notifications/NotificationBox";
import supabase from "../../../services/client";
import UserContext from "../../../contexts/UserContext";
import refreshContext from "../../../contexts/RefreshContext";

export default function NotificationButtonNav({
  userId,
  openNotificationBox,
  handleOpenNotification,
  handleCloseNotification,
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

  // To close the notification list

  const handleNotificationClose = async () => {
    setUnreadNotificationsCount(0);
    handleCloseNotification();
  };
  // To open the notification list
  const handleNotificationClick = () => {
    handleOpenNotification();
  };

  const isOnPRList =
    location.pathname.startsWith("/project/") &&
    uuid &&
    userRole === "contributor";

  return (
    <div>
      {isOnPRList && (
        <div>
          <IconButton
            onClick={() => {
              if (openNotificationBox) {
                handleNotificationClose(); // Si la boîte de notification est ouverte, fermez-la
              } else {
                handleNotificationClick(); // Sinon, ouvrez-la
              }
              // Réinitialisez le compteur d'notifications lors de la fermeture
              setUnreadNotificationsCount(
                openNotificationBox ? 0 : unreadNotificationsCount
              );
            }}
            color="inherit"
          >
            <Badge
              badgeContent={
                unreadNotificationsCount > 0 ? unreadNotificationsCount : null
              }
              color="error"
            >
              <NotificationsNoneOutlinedIcon
                sx={{ color: "white", scale: "1.8" }}
              />
            </Badge>
          </IconButton>

          {openNotificationBox && <NotificationBox userId={userId} />}
        </div>
      )}
    </div>
  );
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
