import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MyCar from "../../UI/client/AddAuto/MyCar";
import Header from "../../UI/client/Header";
import Footer from "../../UI/client/Footer";

const MyCars = () => {
  const [cars, setCars] = useState([]);
  const jwtStr = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:8080/clients/garage`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwtStr
        },
        credentials: "include",
      });      const data = await response.json();
      setCars(data);
    };

    fetchData();
  });

  const removeCarFromList = (carId) => {
    setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
  };

  return (
    <div>
      <Header />
      <div  className="dashboard">
      {cars.map((car) => (
        <MyCar key={car.id} car={car} removeCarFromList={removeCarFromList} />
      ))}
      </div>
      <Footer />
    </div>
  );
};

export default MyCars;
