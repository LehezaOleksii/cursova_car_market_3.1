import React, { useState, useEffect } from "react";
import MyCar from "../../UI/client/AddAuto/MyCar";
import WrappedHeader from "../../WrappedHeader";
import WrappedFooter from "../../WrappedFooter";

const MyCars = () => {
  const [cars, setCars] = useState([]);
  const jwtStr = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchData = async () => {
      const url = `/vehicles/garage`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwtStr
        },
        credentials: "include",
      });
      const data = await response.json();
      setCars(data);
    };

    fetchData();
  }, [jwtStr]);

  const removeCarFromList = (carId) => {
    setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
  };

  return (
    <div>
      <WrappedHeader />
      <div className="dashboard mt-4" style={{minWidth: window.innerWidth < 1535 ? "78vw" : "0"}}>
        {cars.length === 0 ? (
          <div className="no-cars-message mt-5">
            <div className="text-center">You don't have any cars.</div>
          </div>
        ) : (
          cars.map((car) => (
            <MyCar key={car.id} car={car} removeCarFromList={removeCarFromList} />
          ))
        )}
      </div>
      <WrappedFooter />
    </div>
  );
};

export default MyCars;
