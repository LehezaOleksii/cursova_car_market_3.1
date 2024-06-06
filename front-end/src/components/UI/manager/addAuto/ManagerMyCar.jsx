import React from "react";
import { useParams } from "react-router-dom";
import ManagerCarSaleCard from "./ManagerCarSaled";

const MyCar = ({ car, removeCarFromList }) => {
  const { id: managerId } = useParams();

  return <ManagerCarSaleCard car={car} id={managerId} removeCarFromList={removeCarFromList} />;
};

export default MyCar;
