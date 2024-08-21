import React from "react";
import ManagerSaleCar from "./managerDashboard/ManagerSaleCar";

const ManagerSaledCars = ({cars}) => {
  return (
    <div> 
      {cars.length > 0 ? (
        cars.map((car) => (
          <ManagerSaleCar key={car.id} car={car}/>
        ))) 
        : (<div></div>)}
    </div>
  );
};

export default ManagerSaledCars;
