import React, { useState } from 'react';
import ChatWindow from '../../UI/client/chat/ChatWindow';
import ChatsLeftToolbar from '../../UI/client/chat/ChatsLeftToolbar';
import WrappedHeader from "../../WrappedHeader";

const Chats = () => {
  const senderId = localStorage.getItem("id");
  const senderName = "You";

  const [recipientId, setRecipientId] = useState(null);
  const [recipientName, setRecipientName] = useState('');
  const [profileImgUrl, setProfileImgUrl] = useState(null);
  const [chats, setChats] = useState([]); // State to hold chat information

  const handleSelectChat = (id, name, profileImgUrl) => {
    setRecipientId(id);
    setRecipientName(name);
    setProfileImgUrl(profileImgUrl);
  };

  const updateLastMessage = (chatId, message, timestamp) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId
          ? { ...chat, lastMessage: { content: message, timestamp } }
          : chat
      )
    );
  };

  return (
    <div>
      <WrappedHeader />
      <div className="chat-container">
        <ChatsLeftToolbar chats={chats} setChats={setChats} onSelectChat={handleSelectChat} />
        {recipientId ? (
          <ChatWindow
            senderId={senderId}
            recipientId={recipientId}
            recipientName={recipientName}
            senderName={senderName}
            recipientProfileImg={profileImgUrl}
            updateLastMessage={updateLastMessage}
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