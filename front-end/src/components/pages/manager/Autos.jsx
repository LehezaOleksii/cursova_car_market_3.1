import React from "react";
import WrappedHeader from "../../WrappedHeader";
import WrappedFooter from "../../WrappedFooter";
import SaledAutos from "../../UI/manager/autos/SaledAutos";

const Autos = () => { 

  return (   
    <div>
      <WrappedHeader />
      <div className="container">
      <SaledAutos/>
      </div>
      <WrappedFooter />
    </div>
  )
};

export default Autos;