import React, { useEffect, useState, useRef } from 'react';
import { connectWebSocket } from '../../../../components/chat/connectWebSocket';
import { getInitials } from './getInitials';
import './ChatsLeftToolbar.css';

const ChatWindow = ({ senderId, recipientId, recipientName, senderName, recipientProfileImg, onSendMessage }) => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [client, setClient] = useState(null);
    const jwtStr = localStorage.getItem("jwtToken");

    const lastMessageRef = useRef(null);

    useEffect(() => {
        if (client) client.deactivate();
        if (recipientId) {
            fetchChatHistory();
            const wsClient = connectWebSocket(senderId, (newMessage) => {
                setMessages((prev) => [...prev, JSON.parse(newMessage)]);
            });
            setClient(wsClient);

            return () => wsClient.deactivate();
        }
    }, [recipientId]);

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const fetchChatHistory = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/chat/history?firstUserId=${senderId}&secondUserId=${recipientId}`,
                {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${jwtStr}` },
                }
            );
            if (response.ok) {
                const data = await response.json();
                const senderMessages = data.firstMessages.map((msg) => ({ ...msg, isSender: true }));
                const recipientMessages = data.secondMessages.map((msg) => ({ ...msg, isSender: false }));
                const sortedMessages = [...senderMessages, ...recipientMessages].sort(
                    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                );
                setMessages(sortedMessages);
            } else {
                setMessages([]);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        }
    };

    const sendMessage = () => {
        if (client && messageInput.trim()) {
            const chatMessageToSend = { senderId, recipientId, content: messageInput };
            const chatMessage = { senderId, recipientId, content: messageInput, timestamp: new Date().toISOString() };
            client.publish({ destination: '/app/chat', body: JSON.stringify(chatMessageToSend) });
            setMessages((prev) => [...prev, { ...chatMessage, isSender: true }]);
            setMessageInput('');
        }
    };

    const formatDate = (date) => {
        const today = new Date();
        const messageDate = new Date(date);

        const isToday = today.toDateString() === messageDate.toDateString();
        const isYesterday = new Date(today.setDate(today.getDate() - 1)).toDateString() === messageDate.toDateString();

        if (isToday) return 'Today';
        if (isYesterday) return 'Yesterday';

        return messageDate.toLocaleDateString(); // Format as MM/DD/YYYY or DD/MM/YYYY based on locale
    };

    const formatTime = (date) => {
        const messageDate = new Date(date);
        return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="user-info">
                    {recipientProfileImg ? (
                        <img
                            src={`data:image/jpeg;base64,${recipientProfileImg}`}
                            className="profile-picture"
                        />
                    ) : (
                        <div className="initials profile-picture">
                            {getInitials(recipientName || 'Unknown User')}
                        </div>
                    )}
                    <span className="user-name">{recipientName || 'Unknown User'}</span>
                </div>
            </div>
            <div className="messages">
                {messages.length > 0 && (
                    <div className="date-separator">
                        {formatDate(messages[0].timestamp)}
                    </div>
                )}
                {messages.map((msg, index) => {
                    const currentDay = new Date(msg.timestamp).toLocaleDateString();
                    const previousDay = index > 0 ? new Date(messages[index - 1].timestamp).toLocaleDateString() : null;

                    return (
                        <React.Fragment key={index}>
                            {currentDay !== previousDay && (
                                <div className="day-date">
                                    {currentDay === new Date().toLocaleDateString() ? 'Today' : currentDay}
                                </div>
                            )}
                            <div className={`message ${msg.isSender ? 'sender' : 'recipient'}`}>
                                <div className="message-content">
                                <strong>{msg.isSender ? senderName : recipientName}</strong>

                                    <p>{msg.content}</p>
                                    <small>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
                <div ref={lastMessageRef}></div>
            </div>

            <div className="message-input-container">
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="message-input"
                    placeholder='Input message'
                />
                <button onClick={sendMessage} className="send-button">Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;
