import React, { useState, useEffect } from "react";
import { Link} from "react-router-dom";

const Header = () => {
  const [client, setClient] = useState("");
  const [profilePicture, setProfilePicture] = useState('');
  const jwtStr = localStorage.getItem('jwtToken');
  const id = localStorage.getItem('id');

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:8080/clients/cabinet`;
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
                  <Link to={`/client`} className="nav-link" >
                    Home
                  </Link> 
                </li>
                <li className="nav-item">
                  <Link to={`/client/add_auto`} className="nav-link" >
                    Sale car
                  </Link> 
                </li>
                <li className="nav-item">
                  <Link to={`/client/my_autos`} className="nav-link" >
                    My cars
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
            <Link to={`/client/cabinet`} className="dropdown-item" >
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
