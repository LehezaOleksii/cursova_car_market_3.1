import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

const AdminManager = ({ manager,removeManagerFromList }) => {
  const navigate = useNavigate();
  const { id: adminId } = useParams();
  const [profilePicture, setProfilePicture] = useState('');
  const managerId = manager.id;

  const removeManager = async (managerId) => {
    const url = `http://localhost:8080/admins/${adminId}/managers/${managerId}/delete`;
    await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    removeManagerFromList(managerId);
  };

  const UpdateManager = async (managerId) => {
    const url = `http://localhost:8080/admins/${adminId}/managers/${managerId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if(response.ok){
      navigate(`/admin/${adminId}/update/managers/${managerId}`);
    }
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
    fetchProfilePicture(manager.profileImageUrl);
  });

  
  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col-md-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ height: "50px", width: "50px", backgroundColor: "#ccc" }}
          >
  {manager.profileImageUrl ? (
    <img
      src={manager.profileImageUrl ? `data:image/png;base64,${manager.profileImageUrl}` : 'default-image-url'}
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

        {/* User information on the right side */}
        <div className="col-md-8">
          <div className="card-body">
            <div>
              <span className="card-text ms-2">{manager.firstName} {manager.lastName}</span>
              <span className="card-text ms-4">{manager.email}</span>
              {/* <span className="card-text ms-4">RegistrationDate</span> */}
            </div>
          </div>
        </div>
        <div className="col-md-1 d-flex flex-row align-items-center justify-content-center">
          <button className="btn btn-primary me-5" onClick={() => UpdateManager(managerId)}>Update</button>
        </div>
        <div className="col-md-1 d-flex flex-row align-items-center justify-content-center">
          <button className="btn btn-danger me-5" onClick={() => removeManager(managerId)}>Block</button>
        </div>
      </div>
    </div>
  );
};

export default AdminManager;
