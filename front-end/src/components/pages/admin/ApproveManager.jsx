import React, {useState, useEffect} from "react";  
import ApproveManager from "../../UI/admin/approve_manager/ApproveManager";
import WrappedHeader from "../../WrappedHeader";
import WrappedFooter from "../../WrappedFooter";

const ApproveManagersPage = () => {

  const adminId = localStorage.getItem("id");
  const [users, setUsers] = useState([]);
  const jwtStr = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:8080/users/users/toapprove`;
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
      <WrappedHeader />
      <div className="p-5">
        {users.map((manager) => (
          <ApproveManager key={manager.id} manager={manager} id={adminId} removeManagerFromList={removeUserFromList} />
        ))}
      </div>
      <WrappedFooter />
    </div>
  );
};

export default ApproveManagersPage;
