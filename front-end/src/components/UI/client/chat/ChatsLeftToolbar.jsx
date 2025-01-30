import React, { useState, useEffect } from 'react';
import { getInitials } from './getInitials';
import './ChatsLeftToolbar.css';

const ChatsLeftToolbar = ({ chats, setChats, onSelectChat, setUnreadMessagesCount }) => {

  const jwtStr = localStorage.getItem('jwtToken');
  const id = localStorage.getItem('id');

  const [activeChat, setActiveChat] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [externalChats, setExternalChats] = useState([]);

  const [chatId, setChatId] = useState(null);

  const fetchChatRooms = async () => {
    try {
      const response = await fetch(`http://localhost:8080/chat/rooms?id=${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${jwtStr}` },
      });

      if (!response.ok) throw new Error('Failed to fetch chat rooms');

      const data = await response.json();
      const formattedChats = data.map(chat => ({
        ...chat,
        name: chat.firstName && chat.lastName ? `${chat.firstName} ${chat.lastName}` : 'Unknown User',
        unreadMessages: chat.unreadMessages || 0,
      }));

      setChats(formattedChats);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  };

  const handleSearchChange = async (e) => {
    const name = e.target.value.trim();
    setSearchText(name);

    if (!name) {
      setExternalChats([]);
      return;
    }
    await searchExternalChats(name);
  };

  setUnreadMessagesCount(prevCount => {
    const totalUnread = chats.reduce((acc, chat) => acc + chat.unreadMessages, 0);
    return totalUnread;
  });

  const handleChatClick = async (chatId, name, profilePicture, isExternal = false) => {
    onSelectChat(chatId, name, profilePicture);
    setChatId(chatId);
    setActiveChat(chatId);
    setSearchText('');

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, unreadMessages: 0 } : chat
      )
    );
    if (isExternal) {
      setActiveChat(chatId);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const renderChatItem = (chat) => {
    const fullName = chat.name;

    return (
      <li
        key={chat.id}
        className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
        onClick={() => handleChatClick(chat.id, fullName, chat.profilePicture)}
      >
        <div className="chat-info">
          {chat.profilePicture ? (
            <img
              src={`data:image/jpeg;base64,${chat.profilePicture}`}
              alt={`${fullName}'s profile`}
              className="profile-picture blue-border"
            />
          ) : (
            <div className="initials profile-picture blue-border">
              {getInitials(fullName)}
            </div>
          )}
          <div className="chat-details">
            <h3>{fullName.length > 20 ? `${fullName.slice(0, 20)}...` : fullName}</h3>
            <p>{chat.lastMessage ? chat.lastMessage.content : 'No messages yet'}</p>
            {chat.lastMessage && (
              <span className="chat-date">
                {new Date(chat.lastMessage.timestamp).toLocaleString()}
              </span>
            )}
          </div>

          {chat.unreadMessages > 0 && (
            <div className="unread-messages">
              {chat.unreadMessages}
            </div>
          )}
        </div>
      </li>
    );
  };

  const searchExternalChats = async (name) => {
    try {
      const response = await fetch(`http://localhost:8080/chat/users?id=${id}&name=${name}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${jwtStr}` },
      });
      if (!response.ok) throw new Error('Failed to fetch external chats');
      const externalData = await response.json();

      const filteredExternalChats = externalData.filter(externalChat => {
        return !chats.some(existingChat => existingChat.id === externalChat.id);
      });

      const formattedExternalChats = filteredExternalChats.map(chat => ({
        ...chat,
        name: `${chat.firstName || ''} ${chat.lastName || ''}`.trim(),
      }));

      setExternalChats(formattedExternalChats);
    } catch (error) {
      console.error('Error fetching external chats:', error);
    }
  };

  return (
    <div className="chat-list">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search chats..."
          value={searchText}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <ul className="padding-left-0">
        {chats.map((chat) => renderChatItem(chat))}
        {externalChats.length > 0 && (
          <>
            <li className="divider mb-2">Have no chat with</li>
            {externalChats.map(chat => renderChatItem(chat, true))}
          </>
        )}
      </ul>
    </div>
  );
};

export default ChatsLeftToolbar;
