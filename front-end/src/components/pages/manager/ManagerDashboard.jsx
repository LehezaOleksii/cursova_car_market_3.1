import React from "react";
import ManagerUsers from "../../UI/manager/dashboard/ManagerUsers";
import WrappedHeader from "../../WrappedHeader";
import WrappedFooter from "../../WrappedFooter";

const ManagerDashboard = () => {
  return (
    <div >
      <WrappedHeader />
      <div className="dashboard">
      <ManagerUsers />
      </div>
      <WrappedFooter />
    </div>
  )
};

export default ManagerDashboard;
