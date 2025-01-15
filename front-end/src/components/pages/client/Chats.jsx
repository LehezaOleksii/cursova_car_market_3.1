import React, { useState } from 'react';
import ChatWindow from '../../UI/client/chat/ChatWindow';
import ChatsLeftToolbar from '../../UI/client/chat/ChatsLeftToolbar';
import Header from '../../UI/client/Header';


const Chats = () => {
  const senderId = localStorage.getItem("id");
  const senderName = "You";

  const [recipientId, setRecipientId] = useState(null);
  const [recipientName, setRecipientName] = useState('');
  const [profileImgUrl, setProfileImgUrl] = useState(null);

  const handleSelectChat = (id, name, profileImgUrl) => {
    setRecipientId(id);
    setRecipientName(name);
    setProfileImgUrl(profileImgUrl);
  };

  return (
    <div>
      <Header />
      <div className="chat-container">
        <ChatsLeftToolbar onSelectChat={handleSelectChat} />
        {recipientId ? (
          <ChatWindow
            senderId={senderId}
            recipientId={recipientId}
            recipientName={recipientName}
            senderName={senderName}
            recipientProfileImg={profileImgUrl}
          />
        ) : (
          <div className="chat-window">
            <h3>Select a chat to start messaging</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;