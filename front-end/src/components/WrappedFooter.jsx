import React from "react";
import ClientFooter from "../components/UI/client/Footer";
import ManagerFooter from "../components/UI/manager/Footer";

const WrappedFooter = () => {
  const role = localStorage.getItem("role");

  if (role === "ROLE_CLIENT") {
    return <ClientFooter />;
  } else if (role === "ROLE_MANAGER") {
    return <ManagerFooter />;
  }
};

export default WrappedFooter;
