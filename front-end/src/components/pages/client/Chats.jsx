import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ChatWindow from '../../UI/client/chat/ChatWindow';
import ChatsLeftToolbar from '../../UI/client/chat/ChatsLeftToolbar';
import WrappedHeader from "../../WrappedHeader";

const Chats = () => {
  const senderId = localStorage.getItem("id");
  const senderName = "You";
  const jwtStr = localStorage.getItem('jwtToken');

  const [recipientId, setRecipientId] = useState(null);
  const [recipientName, setRecipientName] = useState('');
  const [profileImgUrl, setProfileImgUrl] = useState(null);
  const [chats, setChats] = useState([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get(param);
  };

  useEffect(() => {
    const userId = getQueryParam('userId');

    if (userId) {
      const chat = chats.find(chat => chat.id === Number(userId));

      if (!chat) {
        fetch(`/chat/users/${userId}/my-id/${senderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtStr}`,
          },
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to fetch chat info');
            }
            return response.json();
          })
          .then(data => {
            const newChat = {
              id: data.id,
              name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Unknown User',
              profilePicture: data.profilePicture || null,
              unreadMessages: data.unreadMessages || 0,
              lastMessage: data.lastMessage || null,
            };
            handleSelectChat(newChat.id, newChat.name, newChat.profilePicture);
            console.log(newChat.id, newChat.name, newChat.profilePicture);
          })
          .catch(error => console.error('Error fetching chat info:', error));
      } else {
        handleSelectChat(chat.id, chat.name, chat.profileImgUrl);
        console.log(chat.id, chat.name, chat.profileImgUrl);
      }
    }
  }, [location.search, chats]);

  const handleSelectChat = (id, name, profileImgUrl) => {
    setRecipientId(id);
    setRecipientName(name);
    setProfileImgUrl(profileImgUrl);

    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === id) {
          return { ...chat };
        }
        return chat;
      });
    });
    setUnreadMessagesCount(prevCount => {
      const totalUnread = chats.reduce((acc, chat) => acc + chat.unreadMessages, 0);
      return totalUnread - chats.find(chat => chat.id === id)?.unreadMessages || 0;
    });
    navigate('/chats', { replace: true });
  };

  const updateLastMessage = (chatId, content, timestamp) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId
          ? { ...chat, lastMessage: { content, timestamp } }
          : chat
      )
    );
  };

  return (
    <div>
<div>
  <WrappedHeader unreadMessagesCount={unreadMessagesCount}/>
  <div className="chat-container">
    <div className="chats-left-toolbar">
      <ChatsLeftToolbar
        chats={chats}
        setChats={setChats}
        onSelectChat={handleSelectChat}
        setUnreadMessagesCount={setUnreadMessagesCount}
        updateLastMessage={updateLastMessage}
      />
    </div>
    {recipientId ? (
      <ChatWindow
        senderId={senderId}
        recipientId={recipientId}
        recipientName={recipientName}
        senderName={senderName}
        recipientProfileImg={profileImgUrl}
        setChats={setChats}
        updateLastMessage={updateLastMessage}
      />
    ) : (
      <div className="chat-window">
        <h3>Select a chat to start messaging</h3>
      </div>
    )}
  </div>
</div>

    </div>
  );
};

export default Chats;
