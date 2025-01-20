import React from "react";
import ClientHeader from "../components/UI/client/Header";
import ManagerHeader from "../components/UI/manager/Header";
import AdminHeader from "../components/UI/admin/Header";

const WrappedHeader = () => {
  const role = localStorage.getItem("role");

  if (role === "ROLE_CLIENT") {
    return <ClientHeader />;
  } else if (role === "ROLE_MANAGER") {
    return <ManagerHeader />;
  } else if (role === "ROLE_ADMIN") {
    return <AdminHeader />;
  }
};

export default WrappedHeader;
