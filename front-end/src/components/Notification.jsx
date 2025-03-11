import React from "react";
import "./Notification.css";
import { getInitials } from "./UI/client/chat/getInitials";

const Notification = ({ senderName, senderImage, messageContent, onClose, isFadingOut }) => {
  return (
    <div className={`notification ${isFadingOut ? "fade-out" : ""}`}>
      <div className="notification-image">
        {senderImage ? (
          <img  className="    blue-border"
          src={`data:image/png;base64,${senderImage}`} alt="Sender" />
        ) : (
          <div className="initials profile-picture blue-border">{getInitials(senderName)}</div>
        )}
      </div>
      <div className="notification-content">
        <p className="notification-sender">{senderName}</p>
        <p className="notification-message">{messageContent}</p>
      </div>
      <button className="close-btn" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Notification;
