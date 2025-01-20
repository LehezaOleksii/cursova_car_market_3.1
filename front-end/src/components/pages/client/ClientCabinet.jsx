import React from 'react';
import WrappedHeader from "../../WrappedHeader";
import WrappedFooter from "../../WrappedFooter";
import Cabinet from '../../UI/client/Cabinet/Cabinet';

const ClientCabinet = () => {
  return (
    <Cabinet Header={WrappedHeader} Footer={WrappedFooter} />
  );
};

export default ClientCabinet;
