import React, {useEffect, useState} from "react";
import { useParams } from "react-router";
import Header from "../../UI/admin/Header";
import Footer from "../../UI/admin/Footer";
import AdminManager from "../../UI/admin/dashboard/AdminManager";
// import {getCsrfToken, getCsrfHeaderName} from "../../../csrf"

const AdminDashboard = () => {
  const { id: adminId } = useParams();
  const [managers, setManagers] = useState([]);
  const jwtStr = localStorage.getItem('jwtToken');
  // const csrfToken = localStorage.getItem('csrf');

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:8080/admins/managers`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwtStr,
          // 'X-XSRF-TOKEN': csrfToken,
        },
        // credentials: "include"
      });
      const data = await response.json();
      setManagers(data);
    };
  
    fetchData(); // Call the async function
  }, [jwtStr]); // Dependency array
  

  const removeManagerFromList = (managerId) => {
    setManagers((prevManagers) => prevManagers.filter((manager) => manager.id !== managerId));
  };

  return (
    <div >
      <Header />
      <div className="dashboard">
      {managers.map((manager) => (
        <AdminManager key={manager.id} manager={manager} id={adminId} removeManagerFromList={removeManagerFromList} />
      ))}
      </div>
      <Footer />
    </div>
  )
};

export default AdminDashboard;
