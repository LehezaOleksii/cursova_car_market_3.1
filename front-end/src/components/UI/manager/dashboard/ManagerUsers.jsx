import React, { useState, useEffect } from "react";
import ManagerUserDashboard from "./ManagerUserDashboard";
import { useParams } from "react-router";
import UserFilter from "../../../../components/pages/manager/UserFilter";

const ManagerUsers = () => {
  const { id: managerId } = useParams();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [role, setRole] = useState();
  const [usersPerPage] = useState(10);
  const jwtStr = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:8080/managers/users`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + jwtStr
        },
      });
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    };

    fetchData();
  }, [managerId]);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const url = `http://localhost:8080/clients/role`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtStr,
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
        console.error("Error:", error);
      }
    };
    fetchUserRole();
  }, [jwtStr]);
  

  const updateUserStatus = (userId, newStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    setFilteredUsers((prevFilteredUsers) =>
      prevFilteredUsers.map(user =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };
  

  const handleFilterChange = async (filters) => {
    const { name, email, status, role } = filters;
    const response = await fetch(`http://localhost:8080/managers/clients/filter?name=${name}&email=${email}&status=${status}&role=${role}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + jwtStr,
      },
    });

    if (response.ok) {
      const filteredData = await response.json();
      setFilteredUsers(filteredData.content || filteredData);
      setCurrentPage(1);
    } else {
      console.error("Failed to fetch filtered users");
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div>
      <UserFilter onFilterChange={handleFilterChange} />
      {currentUsers.map((user) => (
        <ManagerUserDashboard
          key={user.id}
          user={user}
          updateUserStatus={updateUserStatus}
          currentRole={role}
        />
      ))}
      <nav aria-label="User pagination">
        <ul className="pagination justify-content-center mt-4">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
          </li>
          <li className="page-item disabled">
            <span className="page-link">Page {currentPage} of {totalPages || 1}</span>
          </li>
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
