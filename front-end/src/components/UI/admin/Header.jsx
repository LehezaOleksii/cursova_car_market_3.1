import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const Header = () => {
  const { id } = useParams();
  const [admin, setAdmin] = useState("");
  const [profilePicture, setProfilePicture] = useState('');
  const jwtStr = localStorage.getItem('jwtToken');
  const userId = localStorage.getItem('id');

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:8080/clients/cabinet/${userId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwtStr,
        },
      });
      const data = await response.json();
      setAdmin(data);
      fetchProfilePicture(data.profileImageUrl) 
    };
    fetchData();
  }, [id]);

  const fetchProfilePicture = (updateProfileImage) => {
    if(updateProfileImage === null){
      const pictureUrl = 'https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png';
      setProfilePicture(pictureUrl);
    }
    else{
      setProfilePicture(updateProfileImage);
    }
  };

  return (
    <header className="py-3 mb-3 border-bottom">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <ul className="navbar-nav">
                <li className="nav-item">
                <Link to={`/admin`} className="nav-link" >
                    Home
                </Link> 
                </li>
                <li className="nav-item">
                  <Link to={`/admin/approve/managers`} className="nav-link" >
                    Update user status
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
  {admin.profileImageUrl ? (
    <img
      src={admin.profileImageUrl ? `data:image/png;base64,${admin.profileImageUrl}` : 'default-image-url'}
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
            <Link to={`/admin/cabinet`} className="dropdown-item" 
            >
              Settings
            </Link>
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
