import React, {useEffect, useState} from "react";
import WrappedHeader from "../../WrappedHeader";
import WrappedFooter from "../../WrappedFooter";
import AdminManager from "../../UI/admin/dashboard/AdminManager";

const AdminDashboard = () => {
  
  const adminId = localStorage.getItem("id");
  const [managers, setManagers] = useState([]);
  const jwtStr = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:8080/users`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwtStr,
        },
      });
      const data = await response.json();
      setManagers(data);
    };
  
    fetchData();
  }, [jwtStr]);
  

  const removeManagerFromList = (managerId) => {
    setManagers((prevManagers) => prevManagers.filter((manager) => manager.id !== managerId));
  };

  return (
    <div >
      <WrappedHeader />
      <div className="dashboard">
      {managers.map((manager) => (
        <AdminManager key={manager.id} manager={manager} id={adminId} removeManagerFromList={removeManagerFromList} />
      ))}
      </div>
      <WrappedFooter />
    </div>
  )
};

export default AdminDashboard;
