import React from "react";

const MessageList = ({ messages, userId }) => {
  return (
    <ul className="list-group mb-3">
      {messages.map((msg, index) => (
        <li
          key={index}
          className={`list-group-item ${
            msg.senderId === userId ? "text-end bg-light" : ""
          }`}
        >
          <strong>{msg.senderId === userId ? "You" : msg.senderId}:</strong>{" "}
          {msg.content}
        </li>
      ))}
    </ul>
  );
};

export default MessageList;
