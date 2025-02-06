import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ManagerMyCar from "../../UI/manager/addAuto/ManagerMyCar";
import WrappedHeader from "../../WrappedHeader";
import WrappedFooter from "../../WrappedFooter";

const ManagerMyCars = () => {

  const managerId = localStorage.getItem("id");
  const [cars, setCars] = useState([]);
  const jwtStr = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchCarData = async () => {
      const url = `http://localhost:8080/users/${managerId}/garage`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtStr
          },
          credentials: "include",
        });
        const cars = await response.json();
        setCars(cars);
    };
    fetchCarData();
  }, [managerId]);


  const removeCarFromList = (carId) => {
    setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
  };

  return (
    <div>
      <WrappedHeader />
      <div  className="dashboard">
      {cars.map((car) => (
        <ManagerMyCar key={car.id} car={car} id={managerId} removeCarFromList={removeCarFromList} />
      ))}
      </div>
      <WrappedFooter />
    </div>
  );
};

export default ManagerMyCars;
