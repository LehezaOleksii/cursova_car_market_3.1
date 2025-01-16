import React, { useState, useEffect } from 'react';
import { getInitials } from './getInitials';
import './ChatsLeftToolbar.css';

const ChatsLeftToolbar = ({ chats,setChats, onSelectChat }) => {
  const jwtStr = localStorage.getItem('jwtToken');
  const id = localStorage.getItem('id');
  
  const [activeChat, setActiveChat] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredChats, setFilteredChats] = useState([]);
  const [externalChats, setExternalChats] = useState([]);

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
      }));

      setChats(formattedChats);
      setFilteredChats(formattedChats);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    }
  };

  const handleSearchChange = async (e) => {
    const name = e.target.value.trim();
    setSearchText(name);

    if (!name) {
      setFilteredChats(chats);
      setExternalChats([]);
      return;
    }

    const filtered = chats.filter(chat => chat.name.toLowerCase().includes(name.toLowerCase()));
    setFilteredChats(filtered);
    await searchExternalChats(name);
  };

  const handleChatClick = (chatId, name, profilePicture, isExternal = false) => {
    // Set active status for the clicked chat, whether it's internal or external
    onSelectChat(chatId, name, profilePicture);
    setActiveChat(chatId);
    setSearchText('');
  
    // If it's an external chat, set it as active
    if (isExternal) {
      setActiveChat(chatId);  // Ensure the external chat is marked as active
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
        onClick={() => onSelectChat(chat.id, fullName, chat.profilePicture)}
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
  
      // Filter out users already in the chats collection
      const filteredExternalChats = externalData.filter(externalChat => {
        return !chats.some(existingChat => existingChat.id === externalChat.id);
      });
  
      // Format the external chats to include first and last names
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
      </ul>
    </div>
  );
};

export default ChatsLeftToolbar;
