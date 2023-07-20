import React, { useContext } from "react";
import NotificationContext from "../../contexts/alertContext";

const Alert = () => {
  const notification = useContext(NotificationContext);

  return(<div className="alert-display">
    {notification.notification !== null && (
      <div className={notification.notification}>
        {notification.notificationText}
      </div>
    )}
  </div>);
};

export default Alert;
