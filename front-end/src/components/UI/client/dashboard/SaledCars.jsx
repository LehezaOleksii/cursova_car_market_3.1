import React from "react";
import Car from "../DashboardCar/Car";

const SaledCars = ({ cars }) => {
  return (
    <div>
      {cars.length > 0 ? (
        cars.map((car) => <Car key={car.id} car={car} />)
      ) : (
        <div className="text-center mt-4">No cars found.</div>
      )}
    </div>
  );
};

export default SaledCars;
