import React from 'react';
import ClientHeader from "../../UI/client/Header";
import ClientFooter from "../../UI/client/Footer";
import Cabinet from '../../UI/client/Cabinet/Cabinet';

const ClientCabinet = () => {
  return (
    <Cabinet Header={ClientHeader} Footer={ClientFooter} />
  );
};

export default ClientCabinet;
