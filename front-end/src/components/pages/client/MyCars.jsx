import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MyCar from "../../UI/client/AddAuto/MyCar";
import Header from "../../UI/client/Header";
import Footer from "../../UI/client/Footer";

const MyCars = () => {
  const { id: clientId } = useParams();
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:8080/clients/${clientId}/garage`;
      const response = await fetch(url);
      const data = await response.json();
      setCars(data);
    };

    fetchData();
  }, [clientId]);

  const removeCarFromList = (carId) => {
    setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
  };

  return (
    <div>
      <Header />
      <div  className="dashboard">
      {cars.map((car) => (
        <MyCar key={car.id} car={car} id={clientId} removeCarFromList={removeCarFromList} />
      ))}
      </div>
      <Footer />
    </div>
  );
};

export default MyCars;
