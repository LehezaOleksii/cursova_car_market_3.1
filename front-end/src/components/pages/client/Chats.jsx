import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './Chats.css';

const Chats = () => {
    const [chatUsers, setChatUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const jwtStr = localStorage.getItem('jwtToken');
    const id = localStorage.getItem("id");

    useEffect(() => {
        try {
            const fetchData = async () => {
                const url = `http://localhost:8080/chat/rooms?id=${id}`;
                const response = await fetch(url, {
                    method: 'GET',
                    params: { id },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + jwtStr
                    },
                    credentials: "include",
                });
                const data = await response.json();
                setChatUsers(data);
            };
            fetchData();
        } catch (err) {
            setError('Failed to fetch chat users.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    if (loading) {
        return <div className="loading">Loading chats...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="chat-container">
            <h2>Your Chats</h2>
            {chatUsers.length === 0 ? (
                <p>No chats available.</p>
            ) : (
                <ul className="chat-list">
                    {Array.isArray(chatUsers) && chatUsers.length > 0 ? (
                        chatUsers.map(user => (
                            <li key={user.id} className="chat-item">
                                <div className="user-avatar">
                                    {user.profilePicture ? (
                                        <img
                                            src={`data:image/png;base64,${user.profilePicture}`}
                                        />
                                    ) : (
                                        <div className="default-avatar">
                                            {user.firstName.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="user-info">
                                    <h4>{user.firstName} {user.lastName}</h4>
                                    <p>{user.email}</p>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p>No users found</p>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Chats;
