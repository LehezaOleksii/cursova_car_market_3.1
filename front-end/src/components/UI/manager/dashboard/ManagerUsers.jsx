import React, {useState, useEffect} from "react";
import ManagerUserDashboard from "./ManagerUserDashboard";
import { useParams } from "react-router";

const ManagerUsers = () => {
  
  const { id: managerId } = useParams();
  const [users, setUsers] = useState([]);
  const jwtStr = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:8080/managers/${managerId}/clients`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwtStr
        },
      });
      const data = await response.json();
      setUsers(data);
    };

    fetchData();
  }, [managerId]);

  const removeUserFromList = (userId) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };
  
  return (
    <div>
      <div>
        {users.map((user) => (
          <ManagerUserDashboard key={user.id} user={user} id={managerId} removeUserFromList={removeUserFromList} />
        ))}
      </div>
    </div>
  );
};

export default ManagerUsers;
