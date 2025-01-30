import React, { useState, useEffect } from "react";
import ClientHeader from "../components/UI/client/Header";
import ManagerHeader from "../components/UI/manager/Header";
import AdminHeader from "../components/UI/admin/Header";
import Notification from "./Notification";

const WrappedHeader = ({ unreadMessagesCount }) => {
  const role = localStorage.getItem("role");
  const [notifications, setNotifications] = useState([]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     const newNotification = {
  //       id: Date.now(),
  //       senderName: "John Doe",
  //       senderImage: "https://via.placeholder.com/40",
  //       messageContent: "Hello, you have a new message!",
  //     };

  //     setNotifications((prev) => [...prev, newNotification]);
  //     setUnreadMessagesCount((prev) => prev + 1);

  //     setTimeout(() => {
  //       setNotifications((prev) =>
  //         prev.map((notification) =>
  //           notification.id === newNotification.id
  //             ? { ...notification, isFadingOut: true }
  //             : notification
  //         )
  //       );
  //       setTimeout(() => {
  //         setNotifications((prev) =>
  //           prev.filter((notification) => notification.id !== newNotification.id)
  //         );
  //       }, 500);
  //     }, 10000);
  //   }, 5000); // Simulate a new message every 5 seconds TODO

  //   return () => clearTimeout(timer);
  // }, []);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  return (
    <div>
      {role === "ROLE_CLIENT" && <ClientHeader unreadMessagesCount={unreadMessagesCount} />}
      {role === "ROLE_MANAGER" && <ManagerHeader unreadMessagesCount={unreadMessagesCount} />}
      {role === "ROLE_ADMIN" && <AdminHeader unreadMessagesCount={unreadMessagesCount} />}
    
      <div className="notification-container">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            senderName={notification.senderName}
            senderImage={notification.senderImage}
            messageContent={notification.messageContent}
            onClose={() => removeNotification(notification.id)}
            isFadingOut={notification.isFadingOut}
          />
        ))}
      </div>
    </div>
  );
};

export default WrappedHeader;
