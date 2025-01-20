import React from "react";
import ClientFooter from "../components/UI/client/Footer";
import ManagerFooter from "../components/UI/manager/Footer";
import AdminFooter from "../components/UI/admin/Footer";

const WrappedFooter = () => {
  const role = localStorage.getItem("role");

  if (role === "ROLE_CLIENT") {
    return <ClientFooter />;
  } else if (role === "ROLE_MANAGER") {
    return <ManagerFooter />;
  } else if (role === "ROLE_ADMIN") {
    return <AdminFooter />;
  }
};

export default WrappedFooter;
