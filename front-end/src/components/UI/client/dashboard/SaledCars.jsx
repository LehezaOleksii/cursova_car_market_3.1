import React from "react";
import Car from "../DashboardCar/Car";
const SaledCars = ({cars}) => {
  return (
    <div> 
      {cars.length > 0 ? (
        cars.map((car) => (
          <Car key={car.id} car={car}/>
        ))) 
        : (<div></div>)}
    </div>
  );
};

export default SaledCars;
