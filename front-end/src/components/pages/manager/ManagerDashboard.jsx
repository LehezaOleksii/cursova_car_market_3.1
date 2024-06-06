import React from "react";
import ManagerUsers from "../../UI/manager/dashboard/ManagerUsers";
import Header from "../../UI/manager/Header";
import Footer from "../../UI/manager/Footer";

const ManagerDashboard = () => {
  return (
    <div >
      <Header />
      <div className="dashboard">
      <ManagerUsers />
      </div>
      <Footer />
    </div>
  )
};

export default ManagerDashboard;
