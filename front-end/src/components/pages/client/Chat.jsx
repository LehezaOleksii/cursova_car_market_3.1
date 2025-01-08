import React, { useEffect, useState } from 'react';
import { connectWebSocket } from '../../chat/connectWebSocket';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const { recipientId } = useParams();
  const senderId = localStorage.getItem("id");

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [client, setClient] = useState(null);
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const jwtStr = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetchChatHistory();
    getFullUserName(senderId).then(setSenderName);
    getFullUserName(recipientId).then(setRecipientName);

    const wsClient = connectWebSocket(senderId, (newMessage) => {
      setMessages((prev) => [...prev, JSON.parse(newMessage)]);
    });
    setClient(wsClient);
    return () => wsClient.deactivate();
  }, [recipientId, senderId]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/chat/history?firstUserId=${senderId}&secondUserId=${recipientId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + jwtStr,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch chat history');
      }

      const data = await response.json();

      const senderMessages = data.firstMessages.map((msg) => ({
        ...msg,
        isSender: true,
      }));

      const recipientMessages = data.secondMessages.map((msg) => ({
        ...msg,
        isSender: false,
      }));

      const sortedMessages = [
        ...senderMessages,
        ...recipientMessages,
      ]
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };
  const getFullUserName = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/clients/${userId}/name`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + jwtStr
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user name');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching user name:', error);
      return userId;
    }
  };

  const sendMessage = () => {
    if (client && messageInput.trim()) {
      const chatMessage = {
        senderId: senderId,
        recipientId: recipientId,
        content: messageInput,
      };

      client.publish({
        destination: '/app/chat',
        body: JSON.stringify(chatMessage),
      });

      setMessages((prev) => [
        ...prev,
        { ...chatMessage, isSender: true },
      ]);
      setMessageInput('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h3>Chat with {recipientName}</h3>
      <div
        style={{
          height: '400px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
          marginBottom: '10px',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: msg.isSender ? 'row-reverse' : 'row',
              justifyContent: msg.isSender ? 'flex-end' : 'flex-start',
              margin: '5px 0',
            }}
          >
            <div
              style={{
                backgroundColor: msg.isSender ? '#DCF8C6' : '#F1F0F0',
                padding: '10px',
                borderRadius: '10px',
                maxWidth: '60%',
              }}
            >
              <strong>{msg.isSender ? senderName : recipientName}</strong>
              <p style={{ margin: '5px 0' }}>{msg.content}</p>
              <small style={{ fontSize: '0.8em', color: '#888' }}>
                {new Date(msg.timestamp).toLocaleString()}
              </small>
            </div>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        style={{ width: 'calc(100% - 80px)', marginRight: '10px' }}
      />
      <button onClick={sendMessage} style={{ width: '70px' }}>
        Send
      </button>
    </div>
  );
};

export default Chat;
