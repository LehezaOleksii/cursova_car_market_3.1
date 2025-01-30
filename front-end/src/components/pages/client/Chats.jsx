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
  const [chats, setChats] = useState([]); 
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const handleSelectChat = (id, name, profileImgUrl) => {
    setRecipientId(id);
    setRecipientName(name);
    setProfileImgUrl(profileImgUrl);

    // Mark messages as read
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === id) {
          return { ...chat, unreadMessages: 0 };
        }
        return chat;
      });
    });

    // Update unread message count in header
    setUnreadMessagesCount(prevCount => {
      const totalUnread = chats.reduce((acc, chat) => acc + chat.unreadMessages, 0);
      return totalUnread - chats.find(chat => chat.id === id)?.unreadMessages || 0;
    });
  };

  return (
    <div>
      <WrappedHeader unreadMessagesCount={unreadMessagesCount} />
      <div className="chat-container">
        <ChatsLeftToolbar 
          chats={chats} 
          setChats={setChats} 
          onSelectChat={handleSelectChat} 
          setUnreadMessagesCount={setUnreadMessagesCount}
        />
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