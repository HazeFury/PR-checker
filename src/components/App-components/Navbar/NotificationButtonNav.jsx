import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import NotificationBox from "./Notifications/NotificationBox";
import styles from "./NotificationButtonNav.module.css";

export default function NotificationButtonNav() {
  const [openNotificationBox, setOpenNotificationBox] = useState(false);
  const location = useLocation();
  const { uuid } = useParams();

  const handleNotification = () => {
    setOpenNotificationBox(!openNotificationBox);
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
