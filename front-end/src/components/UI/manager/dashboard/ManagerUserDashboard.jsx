import React, { useState, useEffect } from "react";

const ManagerUserDashboard = ({ user, updateUserStatus, currentRole }) => {
  const [profilePicture, setProfilePicture] = useState('');
  const jwtStr = localStorage.getItem('jwtToken');

  const Roles = {
    ROLE_CLIENT: 1,
    ROLE_MANAGER: 2,
    ROLE_ADMIN: 3,
  };

  const roleMapping = {
    "ROLE_CLIENT": Roles.ROLE_CLIENT,
    "ROLE_MANAGER": Roles.ROLE_MANAGER,
    "ROLE_ADMIN": Roles.ROLE_ADMIN,
  };

  const blockUser = async () => {
    const url = `http://localhost:8080/managers/clients/${user.id}/block`;
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtStr
      },
    });
    // Call to update the status in the parent component
    updateUserStatus(user.id, "BLOCKED");
  };
  
  const unblockUser = async () => {
    const url = `http://localhost:8080/managers/clients/${user.id}/unblock`;
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtStr
      },
    });
    // Call to update the status in the parent component
    updateUserStatus(user.id, "ACTIVE");
  };
  

  const fetchProfilePicture = (profileImageUrl) => {
    if (profileImageUrl === null) {
      const pictureUrl = 'https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png';
      setProfilePicture(pictureUrl);
    } else {
      setProfilePicture(profileImageUrl);
    }
  };

  const sendMessage = async () => {
    const messageContent = "Your message here";
    const url = `http://localhost:8080/managers/clients/${user.id}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtStr,
      },
      body: JSON.stringify({ content: messageContent }),
    });
  };

  useEffect(() => {
    fetchProfilePicture(user.profileImageUrl);
  }, [user.profileImageUrl]);

  const getNumericRole = (roleString) => {
    return roleMapping[roleString] || 0;
  };

  const canManageUser = () => {
    return getNumericRole(currentRole) > getNumericRole(user.userRole);
  };

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
                src={`data:image/png;base64,${user.profileImageUrl}`}
                className="rounded-circle"
                width="50"
                height="50"
                alt="Profile"
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
        <div className="col-md-5">
          <div className="card-body">
            <div>
              <span className="card-text ms-2">{user.firstName} {user.lastName}</span>
              <span className="card-text ms-4">{user.email}</span>
            </div>
          </div>
        </div>
        <div className="col-md-5 d-flex align-items-center justify-content-end">
          <button className="btn btn-primary me-2" onClick={sendMessage}>
            Send Message
          </button>
          {canManageUser() && (
            user.status === "BLOCKED" ? (
              <button className="btn btn-primary me-3" onClick={unblockUser}>
                Unblock user
              </button>
            ) : (
              <button className="btn btn-danger me-3" onClick={blockUser}>
                Block user
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerUserDashboard;
