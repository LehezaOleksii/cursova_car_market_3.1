import React from "react";
import "./Notification.css";

const Notification = ({ senderName, senderImage, messageContent, onClose, isFadingOut }) => {
  return (
    <div className={`notification ${isFadingOut ? "fade-out" : ""}`}>
      <div className="notification-image">
        <img src={senderImage} alt="Sender" />
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
