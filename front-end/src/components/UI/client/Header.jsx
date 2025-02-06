import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../headerStyles.css";

const Header = ({ unreadMessagesCount, setUnreadMessagesCount }) => {
  const [client, setClient] = useState("");
  const [profilePicture, setProfilePicture] = useState('');
  const jwtStr = localStorage.getItem('jwtToken');
  const id = localStorage.getItem('id');

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:8080/users/cabinet`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwtStr
        },
      });
      const data = await response.json();
      setClient(data);
      fetchProfilePicture(data.profileImageUrl);
      fetchUnreadMessagesCount();
    };
    fetchData();
  }, [id]);

  const fetchProfilePicture = (updateProfileImage) => {
    if (!updateProfileImage) {
      setProfilePicture('https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png');
    } else {
      setProfilePicture(updateProfileImage);
    }
  };

  const fetchUnreadMessagesCount = async () => {
    const url = `http://localhost:8080/chat/users/${id}/messages/unread`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtStr
      },
    });
    const data = await response.json();
    
    // Update unread messages count using the function
    setUnreadMessagesCount(data.data);
  };

  return (
    <header className="py-3 border-bottom">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to={`/dashboard`} className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                  <Link to={`/add_auto`} className="nav-link">Sale car</Link>
                </li>
                <li className="nav-item">
                  <Link to={`/my_autos`} className="nav-link">My cars</Link>
                </li>
                <li className="nav-item">
                  <Link to={`/advanced_filter`} className="nav-link">Filter</Link>
                </li>
                <li className="nav-item">
                  <Link to={`/cars?isLiked=true`} className="nav-link">Liked cars</Link>
                </li>
                <li className="nav-item position-relative">
                  <Link to={`/chats`} className="nav-link">
                    Chats
                    {unreadMessagesCount > 0 && (
                      <span className="unread-badge">{unreadMessagesCount}</span>
                    )}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="flex-shrink-0 dropdown ml-5">
          <a
            href="#"
            className="d-block link-dark text-decoration-none dropdown-toggle"
            id="dropdownUser2"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src={client.profileImageUrl ? `data:image/png;base64,${client.profileImageUrl}` : profilePicture}
              className="rounded-circle"
              width="44"
              height="44"
              alt="Profile"
            />
          </a>
          <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser2">
            <li><Link to={`/cabinet`} className="dropdown-item">Profile</Link></li>
            <li><hr className="dropdown-divider" /></li>
            <li><Link className="dropdown-item" to="/signout">Sign Out</Link></li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
