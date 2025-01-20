import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const ManagerUserDashboard = ({ user, updateUserStatus, currentRole }) => {
  const [profilePicture, setProfilePicture] = useState('');
  const jwtStr = localStorage.getItem('jwtToken');
  const navigate = useNavigate();

  const roleMapping = {
    "ROLE_CLIENT": "Client",
    "ROLE_MANAGER": "Manager",
    "ROLE_ADMIN": "Admin",
  };

  const changeUserStatus = async (newStatus) => {
    const url = `http://localhost:8080/users/${user.id}/status/${newStatus}`;
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + jwtStr
      },
    });
    updateUserStatus(user.id, newStatus);
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
    navigate(`/chats?recipientId=${user.id}`);
  };


  useEffect(() => {
    fetchProfilePicture(user.profileImageUrl);
  }, [user.profileImageUrl]);

  const getNumericRole = (roleString) => {
    return roleMapping[roleString] || "Unknown";
  };

  const getRoleFormNumber = (roleString) => {
    switch (roleString) {
      case "ROLE_CLIENT":
        return 1;
      case "ROLE_MANAGER":
        return 2;
      case "ROLE_ADMIN":
        return 3;
      default:
        return 0;
    }
  };

  const canManageUser = () => {
    return getRoleFormNumber(currentRole) > getRoleFormNumber(user.userRole);
  };

  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col-md-1">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center mt-2 mb-2"
            style={{
              height: "50px",
              width: "50px",
              backgroundColor: "#ccc",
              marginLeft: "10px",
            }}
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
        <div className="col-md-7">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <span className="card-text ms-4 col-md-5">{user.firstName} {user.lastName}</span>
              <span className="card-text ms-4 col-md-4">{user.email || "No Email Provided"}</span>
              <span className="card-text ms-4 col-md-3">{getNumericRole(user.userRole) || "No Role Assigned"}</span>
            </div>
          </div>
        </div>
        <div className="col-md-4 d-flex align-items-center justify-content-end">
          <div className="col-5">
            <button className="btn btn-primary" style={{ width: "130px" }} onClick={sendMessage}>
              Send message
            </button>
          </div>
          <div className="col-4 me-3">
            {
              canManageUser() ? (
                user.status === "BLOCKED" ? (
                  <button className="btn btn-primary" style={{ width: "120px" }} onClick={() => changeUserStatus("ACTIVE")}>
                    Unblock user
                  </button>
                ) : user.status === "INACTIVE" ? (
                  <button className="btn btn-success" style={{ width: "120px" }} onClick={() => changeUserStatus("ACTIVE")}>
                    Activate user
                  </button>
                ) : (
                  <button className="btn btn-danger" style={{ width: "120px" }} onClick={() => changeUserStatus("BLOCKED")}>
                    Block user
                  </button>
                )
              ) : (
                user.status === "BLOCKED" ? (
                  <button className="btn btn-secondary" style={{ width: "120px" }} disabled>
                    Unblock user
                  </button>
                ) : user.status === "INACTIVE" ? (
                  <button className="btn btn-secondary" style={{ width: "120px" }} disabled>
                    Activate user
                  </button>
                ) : (
                  <button className="btn btn-secondary" style={{ width: "120px" }} disabled>
                    Block user
                  </button>
                )
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerUserDashboard;
