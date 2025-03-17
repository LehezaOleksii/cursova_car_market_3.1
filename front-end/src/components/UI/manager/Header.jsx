import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './style.css';

const Header = () => {
  const [client, setClient] = useState("");
  const [profilePicture, setProfilePicture] = useState('');
  const jwtStr = localStorage.getItem('jwtToken');
  const id = localStorage.getItem('id');

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://auto-market-backend:8080/users/cabinet`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwtStr
        },
      });
      const data = await response.json();
      setClient(data);
      fetchProfilePicture(data.profileImageUrl)
    };
    fetchData();
  }, [id]);

  const fetchProfilePicture = (updateProfileImage) => {
    if (updateProfileImage === null) {
      const pictureUrl = 'https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png';
      setProfilePicture(pictureUrl);
    }
    else {
      setProfilePicture(updateProfileImage);
    }
  };

  return (
    <header className="pt-3 border-bottom">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to={`/dashboard`} className="nav-link">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={`/add_auto`} className="nav-link">
                    Sale car
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={`/my_cars`} className="nav-link">
                    My cars
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={`/advanced_filter`} className="nav-link">
                    Advanced filter
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={`/cars?isLiked=true`} className="nav-link">
                    Favorite cars
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={`/chats`} className="nav-link">
                    Chats
                  </Link>
                </li>
                <li className="nav-item delimiter"></li>
                <div>
                  <div className="d-flex justify-content-center">
                    <li className="nav-item">
                      <Link to={`/users`} className="nav-link">
                        Users
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to={`/cars/managment`} className="nav-link">
                        Moderation cars
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to={`/cars/components`} className="nav-link">
                        Car components
                      </Link>
                    </li>
                  </div>
                  <p className="text-center nav-subtext">System management</p>
                </div>
                <li className="nav-item delimiter"></li>
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
            {client.profileImageUrl ? (
              <img
                src={client.profileImageUrl ? `data:image/png;base64,${client.profileImageUrl}` : 'default-image-url'}
                className="rounded-circle"
                width="44"
                height="44"
              />
            ) : (
              <img
                src={profilePicture}
                className="rounded-circle"
                width="44"
                height="44"
                alt="Default Profile"
              />
            )}
          </a>
          <ul
            className="dropdown-menu text-small shadow"
            aria-labelledby="dropdownUser2"
          >
            <li>
              <Link to={`/cabinet`} className="dropdown-item" >
                Profile
              </Link>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <Link className="dropdown-item" to="/signout">Sign Out</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
export default Header;
