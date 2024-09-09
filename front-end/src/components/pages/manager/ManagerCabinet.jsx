import React from 'react';
import ManagerHeader from "../../UI/manager/Header";
import ManagerFooter from "../../UI/manager/Footer";
import Cabinet from '../../UI/client/Cabinet/Cabinet';

const ClientCabinet = () => {
  return (
    <Cabinet Header={ManagerHeader} Footer={ManagerFooter} />
  );
};

export default ClientCabinet;
