import React from "react";

const ApproveManager = ({ manager, removeManagerFromList}) => {
  const managerId = manager.id;
  const jwtStr = localStorage.getItem('jwtToken');

  const disapproveManager = async (managerId) => {
    const url = `http://localhost:8080/admins/users/${managerId}/delete`;
    await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtStr
      },
    });
    removeManagerFromList(managerId);
  };

  const approveManager = async (userId) => {
    const url = `http://localhost:8080/admins/users/${userId}/approve`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtStr
      },
    });
    removeManagerFromList(userId);
  };

  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col-md-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{ height: "50px", width: "50px", backgroundColor: "#ccc" }}
          >
            <img
              // src="https://example.com/avatar.jpg"
              // className="img-fluid rounded-circle"
            />
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
          <button className="btn btn-primary me-3" onClick={() => approveManager(managerId)}>Update</button>
          <button className="btn btn-danger me-5" onClick={() => disapproveManager(managerId)}>Block</button>
        </div>
      </div>
    </div>
  );
};

export default ApproveManager;
