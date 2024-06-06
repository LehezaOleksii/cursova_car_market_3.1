import React from "react";
import { useParams } from "react-router-dom";
import CarSaleCard from "../dashboard/CarSaleCard";

const MyCar = ({ car, removeCarFromList }) => {
  const { id: clientId } = useParams();

  return <CarSaleCard car={car} id={clientId} removeCarFromList={removeCarFromList} />;
};

export default MyCar;
