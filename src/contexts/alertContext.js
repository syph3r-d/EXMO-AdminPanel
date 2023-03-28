import React, { useState } from 'react';
const NotificationContext = React.createContext({
  notification: null,
  notificationText: null,
  success: () => {},
  error: () => {},
});

const STATES = {
    SUCCESS: 'alert alert-success',
    ERROR: 'alert alert-danger',
  };

const NotificationProvider = (props) => {
    const [notification, setNotification] = useState(null);
    const [notificationText, setNotificationText] = useState(null);
  const success = (text) => {
      window.scroll(0, 0);
      setNotificationText(text);
      setNotification(STATES.SUCCESS);
      setTimeout(()=>clear(),3000);
    };
  const error = (text) => {
      window.scroll(0, 0);
      setNotificationText(text);
      setNotification(STATES.ERROR);
      setTimeout(()=>clear(),3000);
    };
  const clear = () => {
      setNotificationText(null);
      setNotification(null);
    };
  return (
      <NotificationContext.Provider
        value={{
          success, error, clear, notification, notificationText,
        }}
      >
        {props.children}
      </NotificationContext.Provider>
    );
  };

export { NotificationProvider };
export default NotificationContext;