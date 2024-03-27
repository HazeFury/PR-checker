import { useState, useEffect, useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { Menu, Badge, IconButton } from "@mui/material";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationBox from "./Notifications/NotificationBox";
import supabase from "../../../services/client";
import UserContext from "../../../contexts/UserContext";
import refreshContext from "../../../contexts/RefreshContext";

export default function NotificationButtonNav({ userId }) {
  const [openNotificationBox, setOpenNotificationBox] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
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
    setOpenNotificationBox(false);
    setAnchorEl(null);
  };
  // To open the notification list
  const handleNotificationClick = (event) => {
    setOpenNotificationBox(true);
    setAnchorEl(event.currentTarget);
  };

  const isOnPRList =
    location.pathname.startsWith("/project/") &&
    uuid &&
    userRole === "contributor";

  return (
    <div>
      {isOnPRList && (
        <div>
          <IconButton onClick={handleNotificationClick} color="inherit">
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
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => {
              // Reset the unread count when closing the menu
              handleNotificationClose();

              setAnchorEl(null);
            }}
            PaperProps={{
              sx: {
                width: 450,
                height: 210,
                background:
                  "radial-gradient(circle, rgb(40, 40, 40) 0%, rgb(29, 29, 29) 100%)",
                borderRadius: "0 0 10px 10px",
                boxShadow:
                  "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
              },
            }}
          >
            {openNotificationBox && <NotificationBox userId={userId} />}
          </Menu>
        </div>
      )}
    </div>
  );
}

NotificationButtonNav.propTypes = {
  userId: PropTypes.string,
};

NotificationButtonNav.defaultProps = {
  userId: "",
};
