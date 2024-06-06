import React from "react";

const SaledCars = ({cars}) => {
  return (
    <div> 
      {cars.length > 0 ? (
        cars.map((car) => (
          <ManagerCar key={car.id} car={car}/>
        ))) 
        : (<div></div>)}
    </div>
  );
};

export default SaledCars;
