import React, {useState, useEffect} from "react";  
import { useParams } from "react-router";
import ApproveManager from "../../UI/admin/approve_manager/ApproveManager";
import Header from "../../UI/admin/Header";
import Footer from "../../UI/admin/Footer";

const ApproveManagersPage = () => {

  const { id: adminId } = useParams();
  const [users, setUsers] = useState([]);
  const jwtStr = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:8080/admins/users/toapprove`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwtStr
        },
      });      const data = await response.json();
      setUsers(data);
    };

    fetchData();
  }, [adminId]);
  
  
  const removeUserFromList = (userId) => {
    setUsers((prevManagers) => prevManagers.filter((manager) => manager.id !== userId));
  };

  return (
    <div>
      <Header />
      <div className="p-5">
        {users.map((manager) => (
          <ApproveManager key={manager.id} manager={manager} id={adminId} removeManagerFromList={removeUserFromList} />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default ApproveManagersPage;
