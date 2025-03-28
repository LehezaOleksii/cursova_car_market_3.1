import React from "react";

const jwtStr = localStorage.getItem('jwtToken');

const UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED",
};

const UserRole = {
  CLIENT: "ROLE_CLIENT",
  MANAGER: "ROLE_MANAGER"
};

const UserFilter = ({ setUsers, setFilter, setTotalPages, setCurrentPage, filter, pageSize, currentPage }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
    setCurrentPage(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/users/filter?page=${currentPage}&size=${pageSize}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtStr,
          },
          body: JSON.stringify(filter),
        }
      );
      const results = await response.json();
      setUsers(results.content || []);
      setCurrentPage(0);
      setTotalPages(results.totalPages || 1);
    } catch (error) {
      setUsers([]);
      setTotalPages(1);
      setCurrentPage(0);
      console.error("Error occurred while fetching search results:", error);
    }
  };

  return (
    <div className="card mb-4 mt-4 br24 box-shadow-12">
      <div className="card-header">
        <h5 className="card-title text-center">Filter Users</h5>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-3 mb-3">
              <label htmlFor="name" className="form-label">Filter by Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={filter.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter name"
                style={{
                  borderRadius: '12px',
                  boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.06)',
                  transition: 'box-shadow 0.3s ease',
                  padding: '6px 18px',
                }}
              />

            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="email" className="form-label">Filter by Email</label>
              <input
                type="text"
                id="email"
                name="email"
                value={filter.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter email"
                style={{
                  borderRadius: '12px',
                  boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.06)',
                  transition: 'box-shadow 0.3s ease',
                  padding: '6px 18px',
                }}
              />
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="status" className="form-label">Filter by Status</label>
              <select
                id="status"
                name="status"
                value={filter.status}
                onChange={handleChange}
                className="form-select"
                style={{
                  borderRadius: '12px',
                  boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.06)',
                  transition: 'box-shadow 0.3s ease',
                  padding: '6px 18px',
                }}
              >
                <option value="ALL">All Users</option>
                <option value={UserStatus.ACTIVE}>Active</option>
                <option value={UserStatus.INACTIVE}>Inactive</option>
                <option value={UserStatus.BLOCKED}>Blocked</option>
              </select>
            </div>
            <div className="col-md-3 mb-3">
              <label htmlFor="role" className="form-label">Filter by Role</label>
              <select
                id="role"
                name="role"
                value={filter.role}
                onChange={handleChange}
                className="form-select"
                style={{
                  borderRadius: '12px',
                  boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.06)',
                  transition: 'box-shadow 0.3s ease',
                  padding: '6px 18px',
                }}
              >
                <option value="ALL">All Users</option>
                <option value={UserRole.CLIENT}>Clinet</option>
                <option value={UserRole.MANAGER}>Manager</option>
              </select>
            </div>
          </div>
          <div className="d-flex justify-content-center mb-2 mt-2">
            <button type="submit" className="btn btn-primary br24 box-shadow-12" style={{ width: "300px" }}>
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFilter;
