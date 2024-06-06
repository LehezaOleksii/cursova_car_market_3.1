import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Auto from "./Auto";

const SaledAutos = () => {
  const { id: managerId } = useParams();
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:8080/managers/${managerId}/vehicles`;
      const response = await fetch(url);
      const data = await response.json();
      setCars(data);
    };

    fetchData();
  }, [managerId]);

  const removeCarFromList = (carId) => {
    setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
  };

  return (
    <div>
      {cars.map((car) => (
        <Auto key={car.id} car={car} id={managerId} removeCarFromList={removeCarFromList} />
      ))}
    </div>
  );
};

export default SaledAutos;
