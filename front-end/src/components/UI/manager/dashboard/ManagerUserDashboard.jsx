import React, { useState, useEffect } from "react";
import { useParams } from "react-router";

const ManagerUserDashboard = ({ user, removeUserFromList }) => {
  const { id: managerId } = useParams();
  const [profilePicture, setProfilePicture] = useState('');
  const jwtStr = localStorage.getItem('jwtToken');

  const blockUser = async () => {
    const url = `http://localhost:8080/managers/${managerId}/clients/${user.id}/block`;
    await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'headers': {
          'Authorization': 'Bearer ' + jwtStr
        }
      },
      credentials: "include",
    });
    removeUserFromList(user.id);
  };

  const fetchProfilePicture = (profileImageUrl) => {
    if (profileImageUrl === null) {
      const pictureUrl = 'https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png';
      setProfilePicture(pictureUrl);
    } else {
      setProfilePicture(profileImageUrl);
    }
  };

  useEffect(() => {
    fetchProfilePicture(user.profileImageUrl);
  });

  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col-md-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ height: "50px", width: "50px", backgroundColor: "#ccc" }}
          >
  {user.profileImageUrl ? (
    <img
      src={user.profileImageUrl ? `data:image/png;base64,${user.profileImageUrl}` : 'default-image-url'}
      className="rounded-circle"
      width="50"
      height="50"
    />
  ) : (
    <img
      src={profilePicture}
      className="rounded-circle"
      width="50"
      height="50"
      alt="Default Profile"
    />
  )}
          </div>
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <div>
              <span className="card-text ms-2">{user.firstName} {user.lastName}</span>
              <span className="card-text ms-4">{user.email}</span>
              <span className="card-text ms-4">{user.region}</span>
              {/* <span className="card-text ms-4">RegistrationDate</span> */}
              {/* <span className="card-text ms-4">Car sales</span> */}
            </div>
          </div>
        </div>
        <div className="col-md-2 d-flex align-items-center justify-content-center">
          <button className="btn btn-danger" onClick={blockUser}>Block user</button>
        </div>
      </div>
    </div>
  );
};

export default ManagerUserDashboard;
