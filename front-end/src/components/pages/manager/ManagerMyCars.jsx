import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ManagerMyCar from "../../UI/manager/addAuto/ManagerMyCar";
import Header from "../../UI/manager/Header";
import Footer from "../../UI/manager/Footer";

const ManagerMyCars = () => {
  const { id: managerId } = useParams();
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:8080/managers/${managerId}/garage`;
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
      <Header />
      <div  className="dashboard">
      {cars.map((car) => (
        <ManagerMyCar key={car.id} car={car} id={managerId} removeCarFromList={removeCarFromList} />
      ))}
      </div>
      <Footer />
    </div>
  );
};

export default ManagerMyCars;
