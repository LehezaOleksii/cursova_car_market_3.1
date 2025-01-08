import React from "react";

const MessageInput = ({ currentMessage, setCurrentMessage, sendMessage }) => {
  return (
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        placeholder="Type a message"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button className="btn btn-primary" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default MessageInput;
