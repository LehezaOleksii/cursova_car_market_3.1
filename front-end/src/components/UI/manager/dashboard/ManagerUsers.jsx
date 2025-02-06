import React, { useState, useEffect } from "react";
import ManagerUserDashboard from "./ManagerUserDashboard";
import UserFilter from "../../../../components/pages/manager/UserFilter";

const ManagerUsers = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(5);
  const jwtStr = localStorage.getItem('jwtToken');

  const [filter, setFilter] = useState({
    name: "",
    email: "",
    status: "ALL",
    role: "ALL",
  });

  const [baseFilter] = useState({
    name: "",
    email: "",
    status: "ALL",
    role: "ALL",
  });

  useEffect(() => {
    const fetchData = async () => {
      let url = `http://localhost:8080/users?page=${currentPage}&size=${pageSize}`;
        if (filter !== baseFilter) {
        url = `http://localhost:8080/users/filter?page=${currentPage}&size=${pageSize}`;
      }
  
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtStr,
          },
          body: filter !== baseFilter ? JSON.stringify(filter) : null, 
        });
  
        if (response.ok) {
          const data = await response.json();
          setUsers(data.content || []);
          setTotalPages(data.totalPages || 1);
        } else {
          setUsers([]);
          setTotalPages(0);
          console.error("Error fetching users:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
        setUsers([]);
        setTotalPages(1);
      }
    };
      fetchData();
  }, [currentPage, pageSize]);
  

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const url = `http://localhost:8080/users/role`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwtStr,
          },
        });
        if (response.ok) {
          const result = await response.json();
          const roleData = result.data;
          setRole(roleData);
        } else {
          console.error("Error fetching role:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };

    fetchUserRole();
  }, [jwtStr]);

  const updateUserStatus = (userId, newStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div>
      <UserFilter
        setUsers={setUsers}
        setFilter={setFilter}
        setTotalPages={setTotalPages}
        setCurrentPage={setCurrentPage}
        filter={filter}
        pageSize={pageSize}
        currentPage={currentPage}
      />
      <div className="d-flex justify-content-between mb-3">
        <h3>User Management</h3>
      </div>
      {users.map((user) => (
        <ManagerUserDashboard
          key={user.id}
          user={user}
          updateUserStatus={updateUserStatus}
          currentRole={role}
        />
      ))}
      <nav aria-label="User pagination">
        <ul className="pagination justify-content-center mt-4">
          <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
          </li>
          <li className="page-item disabled">
            <span className="page-link">
              Page {currentPage + 1} of {totalPages}
            </span>
          </li>
          <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ManagerUsers;
