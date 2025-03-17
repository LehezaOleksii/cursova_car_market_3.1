import React, { useEffect, useState, useRef } from 'react';
import { connectWebSocket } from '../../../../components/chat/connectWebSocket';
import { getInitials } from './getInitials';
import './ChatsLeftToolbar.css';

const ChatWindow = ({
    senderId,
    recipientId,
    recipientName,
    senderName,
    recipientProfileImg,
    setChats,
    updateLastMessage
}) => {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [client, setClient] = useState(null);
    const jwtStr = localStorage.getItem("jwtToken");

    const lastMessageRef = useRef(null);
    const messageRefs = useRef(new Map());

    useEffect(() => {
        if (recipientId) {
            fetchChatHistory();
            const wsClient = connectWebSocket(senderId, (newMessage) => {
                const response = JSON.parse(newMessage);
                if (response.type === 'MESSAGE_FROM_USER') {
                    const parsedMessage = response.message;
                    updateLastMessage(
                        parsedMessage.recipientId,
                        parsedMessage.content,
                        new Date(parsedMessage.timestamp).toISOString()
                    );
                    if (recipientId == parsedMessage.recipientId) {
                        setMessages((prev) => [...prev, parsedMessage]);
                    }
                } else {
                    markAllMessagesAsRead();
                }
            });
            setClient(wsClient);
            return () => wsClient.deactivate();
        }
    }, [recipientId, senderId, updateLastMessage]);

    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const messageId = entry.target.dataset.id;
                        const message = messages.find((msg) => msg.id === messageId);

                        if (message && message.status === 'SENT' && !message.isSender) {
                            updateMessageStatus(messageId);
                        }
                    }
                });
            },
            { threshold: 0.5 }
        );

        messages.forEach((msg) => {
            if (msg.status === 'SENT' && !msg.isSender) {
                const messageElement = messageRefs.current.get(msg.id);
                if (messageElement) {
                    observer.observe(messageElement);
                }
            }
        });

        return () => observer.disconnect();
    }, [messages]);

    const fetchChatHistory = async () => {
        try {
            const response = await fetch(
                `http://auto-market-backend:8080/chat/history/firstUserId/${senderId}/secondUserId/${recipientId}`,
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

    const updateMessageStatus = async (messageId) => {
        try {
            const message = messages.find((msg) => msg.id === messageId);

            if (!message) {
                console.error('Message not found for status update');
                return;
            }

            await client.publish({
                destination: '/app/chat/message/status',
                body: JSON.stringify({
                    messageId: messageId,
                    senderId: message.isSender ? senderId : recipientId,
                    recipientId: message.isSender ? recipientId : senderId,
                    status: 'READ',
                }),
            });

            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === messageId ? { ...msg, status: 'READ' } : msg
                )
            );

            setChats((prevChats) =>
                prevChats.map((chat) =>
                    chat.id == recipientId
                        ? { ...chat, unreadMessages: (chat.unreadMessages || 0) - 1 }
                        : chat
                )
            );
        } catch (error) {
            console.error('Failed to update message status:', error);
        }
    };

    const sendMessage = () => {
        if (messageInput.trim()) {
            const chatMessageToSend = {
                senderId,
                recipientId,
                content: messageInput,
            };

            const chatMessage = {
                senderId,
                recipientId,
                content: messageInput,
                timestamp: new Date().toISOString(),
            };

            if (recipientId != senderId) {
                setChats((prevChats) => {
                    const chatExists = prevChats.some(chat => chat.id === recipientId);

                    if (!chatExists) {
                        const newChat = {
                            id: recipientId,
                            name: recipientName,
                            unreadMessages: 0,
                            lastMessage: { content: messageInput, timestamp: chatMessage.timestamp }
                        };

                        return [...prevChats, newChat];
                    }
                    return prevChats;
                });
                client.publish({
                    destination: '/app/chat',
                    body: JSON.stringify(chatMessageToSend),
                });
                setMessages((prev) => [...prev, { ...chatMessage, isSender: true }]);
                setMessageInput('');
                updateLastMessage(recipientId, messageInput, chatMessage.timestamp);
            } else {
                alert("You cannot send a message to yourself.");
            }
        }
    };

    const getLastSentMessageId = (isSender) => {
        const sentMessages = messages.filter(msg => msg.isSender === isSender && msg.status === 'SENT');
        return sentMessages.length > 0 ? sentMessages[sentMessages.length - 1].id : null;
    };

    const getLastReadMessageId = (isSender) => {
        const readMessages = messages.filter(msg => msg.isSender === isSender && msg.status === 'READ');
        return readMessages.length > 0 ? readMessages[readMessages.length - 1].id : null;
    };

    const formatDateWithDots = (timestamp) => {
        const date = new Date(timestamp);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const markAllMessagesAsRead = () => {
        setMessages((prev) =>
            prev.map((msg) =>
                msg.status === "SENT" ? { ...msg, status: 'READ' } : msg
            )
        );
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
                {messages.map((msg, index) => {
                    const currentDay = new Date(msg.timestamp).toLocaleDateString();
                    const previousDay = index > 0 ? new Date(messages[index - 1].timestamp).toLocaleDateString() : null;
                    const isLastSentMessage = msg.id === getLastSentMessageId(msg.isSender);
                    const isLastReadMessage = msg.id === getLastReadMessageId(msg.isSender);
                    return (
                        <React.Fragment key={msg.id}>
                            {currentDay !== previousDay && (
                                <div className="day-date">
                                    {currentDay === new Date().toLocaleDateString()
                                        ? 'Today'
                                        : currentDay === (new Date(Date.now() - 86400000)).toLocaleDateString()
                                            ? 'Yesterday'
                                            : formatDateWithDots(currentDay)}
                                </div>
                            )}
                            <div
                                className={`message ${msg.isSender ? 'sender' : 'recipient'}`}
                                ref={(el) => messageRefs.current.set(msg.id, el)}
                                data-id={msg.id}
                            >
                                <div className="message-content">
                                    <strong>{msg.isSender ? senderName : recipientName}</strong>
                                    <p>{msg.content}</p>
                                    <div className="message-details">
                                        <small>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                                        <span className="message-status">
                                            {isLastSentMessage && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check" viewBox="0 0 16 16">
                                                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                                                </svg>
                                            )}
                                            {isLastReadMessage && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-all" viewBox="0 0 16 16">
                                                    <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486z" />
                                                </svg>
                                            )}
                                        </span>
                                    </div>
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
                    className="message-input box-shadow-06"
                    placeholder='Input message'
                />
                <button onClick={sendMessage} className="send-button box-shadow-12">Send</button>
            </div>
        </div>
    );
};

export default ChatWindow;
