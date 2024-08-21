import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
// import {getCsrfToken, getCsrfHeaderName} from "../../../csrf"

const Header = () => {
  const { id } = useParams();
  const [manager, setManager] = useState("");
  const [profilePicture, setProfilePicture] = useState('');
  const jwtStr = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:8080/managers/cabinet`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwtStr
          // [getCsrfHeaderName()]: getCsrfToken(),
        },
        credentials: "include",
      });
      const data = await response.json();
      setManager(data);
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

  const settings = async () => {
      await fetch(`http://localhost:8080/clients/cabinet`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  };

  return (
    <header className="py-3 mb-3 border-bottom">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            {/* <a className="navbar-brand" href="#">
              Navbar
            </a> */}
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <ul className="navbar-nav">
                <li className="nav-item">
                <Link to={`/manager/users`} className="nav-link" >
                    Home
                </Link> 
                </li>
                <li className="nav-item">
                  <Link to={`/manager/add_auto`} className="nav-link" >
                    Sale car
                  </Link> 
                </li>
                <li className="nav-item">
                  <Link to={`/manager/my_autos`} className="nav-link" >
                    My cars
                  </Link> 
                </li>
                <li className="nav-item">
                  <Link to={`/manager/approve/cars`} className="nav-link" >
                    Approve cars
                  </Link> 
                </li>
                <li className="nav-item">
                  <Link to={`/manager/cars`} className="nav-link" >
                    Cars
                  </Link> 
                </li>
                <li className="nav-item">
                  <Link to={`/manager/view/cars`} className="nav-link" >
                    View cars
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
  {manager.profileImageUrl ? (
    <img
      src={manager.profileImageUrl ? `data:image/png;base64,${manager.profileImageUrl}` : 'default-image-url'}
      className="rounded-circle"
      width="32"
      height="32"
    />
  ) : (
    <img
      src={profilePicture}
      className="rounded-circle"
      width="32"
      height="32"
      alt="Default Profile"
    />
  )}
</a>
          <ul
            className="dropdown-menu text-small shadow"
            aria-labelledby="dropdownUser2"
          >
            <li> 
            <Link to={`/manager/cabinet`} className="dropdown-item" onClick={() => settings()}>
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
