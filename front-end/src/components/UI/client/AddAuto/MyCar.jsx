import React from "react";
import CarSaleCard from "../dashboard/CarSaleCard";

const MyCar = ({ car, removeCarFromList }) => {
  const clientId = localStorage.getItem("id");

  return <CarSaleCard car={car} id={clientId} removeCarFromList={removeCarFromList} />;
};

export default MyCar;
