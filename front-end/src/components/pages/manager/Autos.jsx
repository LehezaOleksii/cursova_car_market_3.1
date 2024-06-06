import React from "react";
import Header from "../../UI/manager/Header"; 
import Footer from "../../UI/manager/Footer";
import SaledAutos from "../../UI/manager/autos/SaledAutos";

const Autos = () => { 

  return (   
    <div>
      <Header />
      <div className="container">
      <SaledAutos/>
      </div>
      <Footer />
    </div>
  )
};

export default Autos;