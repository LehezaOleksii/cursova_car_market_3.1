import React, { useState } from "react";

const UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED",
};

const UserRole = {
  CLIENT: "ROLE_CLIENT",
  MANAGER: "ROLE_MANAGER",
  ADMIN: "ROLE_ADMIN",
};

const UserFilter = ({ onFilterChange }) => {
  const [filter, setFilter] = useState({
    name: "",
    email: "",
    status: "ALL",
    role: "ALL", // Initialize the role field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filter);
  };

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h5 className="card-title">Filter Users</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4 mb-3">
              <input
                type="text"
                name="name"
                value={filter.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Filter by Name"
              />
            </div>
            <div className="col-md-4 mb-3">
              <input
                name="email"
                value={filter.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Filter by Email"
              />
            </div>
            <div className="col-md-4 mb-3">
              <select
                name="status"
                value={filter.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="ALL">All Users</option>
                <option value={UserStatus.ACTIVE}>{UserStatus.ACTIVE}</option>
                <option value={UserStatus.INACTIVE}>{UserStatus.INACTIVE}</option>
                <option value={UserStatus.BLOCKED}>{UserStatus.BLOCKED}</option>
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <select
                name="role"
                value={filter.role}
                onChange={handleChange}
                className="form-select"
              >
                <option value="ALL">All Users</option>
                <option value={UserRole.CLIENT}>{UserRole.CLIENT}</option>
                <option value={UserRole.MANAGER}>{UserRole.MANAGER}</option>
                <option value={UserRole.ADMIN}>{UserRole.ADMIN}</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserFilter;
