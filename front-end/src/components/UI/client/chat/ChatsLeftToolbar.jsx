import React, { useState, useEffect } from 'react';
import { getInitials } from './getInitials';
import { connectWebSocket } from '../../../../components/chat/connectWebSocket';
import './ChatsLeftToolbar.css';

const ChatsLeftToolbar = ({ chats, setChats, onSelectChat, setUnreadMessagesCount }) => {
  const jwtStr = localStorage.getItem('jwtToken');
  const id = localStorage.getItem('id');

  const [activeChat, setActiveChat] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [externalChats, setExternalChats] = useState([]);

  const [chatId, setChatId] = useState(null);

  const allChats = [...chats, ...externalChats];
  const filteredChats = allChats.filter(chat => chat.name.toLowerCase().includes(searchText.toLowerCase()));

  const chatsWithNoLastMessage = filteredChats.filter(chat => !chat.lastMessage);
  const chatsWithLastMessage = filteredChats.filter(chat => chat.lastMessage);

  const sortedChatsWithLastMessage = chatsWithLastMessage.sort((a, b) => {
    const dateA = new Date(a.lastMessage.timestamp);
    const dateB = new Date(b.lastMessage.timestamp);
    return dateB - dateA;
  });

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

  useEffect(() => {
    const wsClient = connectWebSocket(id, (newMessage) => {
      const response = JSON.parse(newMessage);
      if (response.type === 'MESSAGE_FROM_USER') {
        const parsedMessage = response.message;
        const content = parsedMessage.content;
        const timestamp = parsedMessage.timestamp;
        const recipientId = new Number(parsedMessage.recipientId);
        
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id == recipientId
              ? { ...chat, lastMessage: { content, timestamp }, unreadMessages: (chat.unreadMessages || 0) + 1 }
              : chat
          )
        );
      }
    });
    return () => wsClient.deactivate();
  });

  const formatDateWithDots = (timestamp) => {
    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

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
            <p>{chat.lastMessage ? chat.lastMessage.content : 'No chat with this user yet'}</p>
            {chat.lastMessage && (
              <span className="chat-date">
                {formatDateWithDots(chat.lastMessage.timestamp)}
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

  const handleSearchChange = async (e) => {
    const name = e.target.value.trim();
    setSearchText(name);

    if (!name) {
      setExternalChats([]);
      return;
    }
    await searchExternalChats(name);
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  useEffect(() => {
    setUnreadMessagesCount(chats.reduce((acc, chat) => acc + chat.unreadMessages, 0));
  }, [chats, setUnreadMessagesCount]);

  const handleChatClick = (chatId, name, profilePicture, isExternal = false) => {
    setExternalChats([]);
    onSelectChat(chatId, name, profilePicture);
    setChatId(chatId);
    setActiveChat(chatId);
    setSearchText('');

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, unreadMessages: 0 } : chat
      )
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
        {sortedChatsWithLastMessage.map(chat => renderChatItem(chat))}
      </ul>

      {chatsWithNoLastMessage.length > 0 && (
        <>
          <hr className="divider" />
          <p className="no-chat-message">No chat with users</p>
        </>
      )}

      {chatsWithNoLastMessage.length > 0 && (
        <ul className="padding-left-0">
          {chatsWithNoLastMessage.map(chat => renderChatItem(chat))}
        </ul>
      )}
    </div>
  );
};

export default ChatsLeftToolbar;
