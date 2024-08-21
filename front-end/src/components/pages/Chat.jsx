import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const Chat = ({ currentUser }) => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [client, setClient] = useState(null);

  useEffect(() => {
    const sock = new SockJS('http://localhost:8080/chat');
    const stompClient = new Client({
      webSocketFactory: () => sock,
      onConnect: () => {
        stompClient.subscribe('/topic/chat', (msg) => {
          const receivedMessage = JSON.parse(msg.body);
          setChats((prevChats) => {
            const chatIndex = prevChats.findIndex(chat => chat.id === receivedMessage.chat.id);
            if (chatIndex !== -1) {
              const updatedChats = [...prevChats];
              updatedChats[chatIndex].messages.push(receivedMessage);
              return updatedChats;
            } else {
              return [...prevChats, receivedMessage.chat];
            }
          });
        });
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const sendMessage = () => {
    if (client && activeChat) {
      const receiver = activeChat.userOne.id === currentUser.id ? activeChat.userTwo : activeChat.userOne;
      const chatMessage = {
        chat: activeChat,
        sender: currentUser,
        receiver: receiver,
        content: message,
      };
      client.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(chatMessage),
      });
      setMessage('');
    }
  };

  return (
    <div>
      <div>
        {chats.map(chat => (
          <button key={chat.id} onClick={() => setActiveChat(chat)}>
            Chat with {chat.userOne.id === currentUser.id ? chat.userTwo.firstName : chat.userOne.firstName}
          </button>
        ))}
      </div>
      <div>
        {activeChat && activeChat.messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender.firstName}: </strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
