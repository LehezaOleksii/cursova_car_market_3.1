import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SaledCars from "../../client/dashboard/SaledCars";
import "./ManagerUserDashboard.css";
import MyCar from "../../client/AddAuto/MyCar";

const ManagerUserDashboard = ({ user, updateUserStatus, currentRole }) => {
  const [profilePicture, setProfilePicture] = useState("");
  const [cars, setCars] = useState([]);
  const [showCars, setShowCars] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const jwtStr = localStorage.getItem("jwtToken");
  const navigate = useNavigate();

  const roleMapping = {
    ROLE_CLIENT: "Client",
    ROLE_MANAGER: "Manager",
    ROLE_ADMIN: "Admin",
  };

  const statusMapping = {
    ACTIVE: "Active",
    BLOCKED: "Blocked",
    INACTIVE: "Inactive",
  };

  const changeUserStatus = async (newStatus) => {
    const url = `http://localhost:8080/users/${user.id}/status/${newStatus}`;
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwtStr,
      },
    });
    updateUserStatus(user.id, newStatus);
  };

  const fetchProfilePicture = (profileImageUrl) => {
    if (profileImageUrl === null) {
      const pictureUrl =
        "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png";
      setProfilePicture(pictureUrl);
    } else {
      setProfilePicture(profileImageUrl);
    }
  };

  const sendMessage = () => {
    navigate(`/chats?userId=${user.id}`);
  };

  const viewUsersCars = async () => {
    if (showCars) {
      setIsAnimating(true);
      setTimeout(() => {
        setShowCars(false);
        setIsAnimating(false);
      }, 500);
    } else {
      const url = `http://localhost:8080/vehicles/users/${user.id}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: "Bearer " + jwtStr,
          },
        });
        if (response.ok) {
          const carsData = await response.json();
          setCars(carsData);
          setShowCars(true);
        } else {
          console.error("Failed to fetch cars");
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    }
  };

  useEffect(() => {
    fetchProfilePicture(user.profileImageUrl);
  }, [user.profileImageUrl]);

  const getNumericRole = (roleString) => roleMapping[roleString] || "Unknown";

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

  const isEnableToChangeStatus = () =>
    getRoleFormNumber(currentRole) > getRoleFormNumber(user.userRole);

  return (
    <div className="card  br16 box-shadow-12 mb-4" style={{ paddingRight: '15px' }}>
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
        <div className="col-md-6">
          <div className="card-body">
            <div className="d-flex justify-content-center align-items-center">
              <span className="card-text text-center col-md-3 truncate">
                {user.firstName} {user.lastName}
              </span>
              <span className="card-text text-center col-md-5 truncate">
                {user.email || "No Email"}
              </span>
              <span className="card-text text-center col-md-2">
                {getNumericRole(user.userRole) || "No Role"}
              </span>
              <span className="card-text text-center col-md-2">
                {statusMapping[user.status] || "No Status"}
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-5 d-flex align-items-center justify-content-end">
          <div className="col-12 d-flex justify-content-center">
            <div className="col-3 mx-2">
              <button className="btn btn-primary w-100 br16" onClick={viewUsersCars}>
                {showCars && !isAnimating ? "Hide cars" : "View cars"}
              </button>
            </div>
            <div className="col-4 mx-2">
              <button className="btn btn-primary w-100 br16" onClick={sendMessage}>
                Send message
              </button>
            </div>
            <div className="col-4 mx-2">
              {isEnableToChangeStatus() ? (
                user.status === "BLOCKED" ? (
                  <button
                    className="btn btn-primary w-100 br16"
                    onClick={() => changeUserStatus("ACTIVE")}
                  >
                    Unblock
                  </button>
                ) : user.status === "INACTIVE" ? (
                  <button
                    className="btn btn-success w-100 br16"
                    onClick={() => changeUserStatus("ACTIVE")}
                  >
                    Activate email
                  </button>
                ) : (
                  <button
                    className="btn btn-danger w-100 br16"
                    onClick={() => changeUserStatus("BLOCKED")}
                  >
                    Block
                  </button>
                )
              ) : user.status === "BLOCKED" ? (
                <button className="btn btn-secondary w-100 br16" disabled>
                  Unblock
                </button>
              ) : user.status === "INACTIVE" ? (
                <button className="btn btn-secondary w-100 br16" disabled>
                  Activate email
                </button>
              ) : (
                <button className="btn btn-secondary w-100 br16" disabled>
                  Block
                </button>
              )}
            </div>
          </div>
        </div>
        
        {
          cars.length > 0 ? (
            cars.map((car) => (
              <div
              className={`saled-cars ${isAnimating ? "hiding" : showCars ? "visible" : "hidden"}`}
              style={{ paddingLeft: '20px', paddingRight: '5px'}}
            >
              {showCars && <MyCar car={car}/>}
            </div>
            ))
          ) : (
            <div
              className={` saled-cars ${isAnimating ? "hiding" : showCars ? "visible" : "hidden"}`} style={{ marginTop: '0px' }}>
              {showCars && <SaledCars cars={cars} />}
            </div>
          )
        }
      </div>
    </div>
  );
};
export default ManagerUserDashboard;
