import React, { useState, useEffect } from "react";
import ClientHeader from "../components/UI/client/Header";
import ManagerHeader from "../components/UI/manager/Header";
import { connectHeaderWebSocket } from "./chat/connectHeaderWebSocket";
import Notification from "./Notification";

const WrappedHeader = () => {
  const role = localStorage.getItem("role");
  const id = localStorage.getItem("id");

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (messageData) => {
    const newNotification = {
      id: messageData.id,
      senderName: `${messageData.firstName || ''} ${messageData.lastName || ''}`.trim() || 'Unknown User',
      senderImage: messageData.profilePicture,
      messageContent: messageData.lastMessage.content,
      isFadingOut: false,
    };

    setNotifications((prev) => [...prev, newNotification]);

    setUnreadMessagesCount((prevCount) => Number(prevCount) + 1);

    setTimeout(() => triggerFadeOut(newNotification.id), 10000);
  };

  const triggerFadeOut = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isFadingOut: true } : n))
    );

    setTimeout(() => removeNotification(id), 500);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  useEffect(() => {
    const wsClient = connectHeaderWebSocket(id, (newMessage) => {
      const response = JSON.parse(newMessage);
      addNotification(response);
    });

    return () => wsClient.deactivate();
  }, [id]);

  return (
    <div>
      {role === "ROLE_CLIENT" && <ClientHeader unreadMessagesCount={unreadMessagesCount} setUnreadMessagesCount={setUnreadMessagesCount} />}
      {role === "ROLE_MANAGER" && <ManagerHeader unreadMessagesCount={unreadMessagesCount} setUnreadMessagesCount={setUnreadMessagesCount} />}
      <div className="notification-container">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            senderName={notification.senderName}
            senderImage={notification.senderImage}
            messageContent={notification.messageContent}
            onClose={() => triggerFadeOut(notification.id)}
            isFadingOut={notification.isFadingOut}
          />
        ))}
      </div>
    </div>
  );
};

export default WrappedHeader;
