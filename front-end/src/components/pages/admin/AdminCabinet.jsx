import React from 'react';
import AdminHeader from "../../UI/admin/Header";
import AdminFooter from "../../UI/admin/Footer";
import Cabinet from '../../UI/client/Cabinet/Cabinet';

const AdminCabinet = () => {
  return (
    <Cabinet Header={AdminHeader} Footer={AdminFooter} />
  );
};

export default AdminCabinet;
