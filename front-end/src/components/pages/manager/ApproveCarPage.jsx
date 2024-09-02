import React, {useState, useEffect} from "react";  
import ApproveCar from "../../UI/manager/approveCar/ApproveCar";
import Header from "../../UI/manager/Header";
import Footer from "../../UI/manager/Footer";

const ApproveCarPage = () => {
  const [cars, setCars] = useState([]);
  const jwtStr = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:8080/managers/vehicles/to_approve`;
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
  });
  
  
  const removeCarFromList = (carId) => {
    setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
  };

  return (
    <div>
      <Header />
      <div className="p-5">
    {cars.length > 0 ? (
    cars.map((car) => (
      <ApproveCar key={car.id} car={car} removeCarFromList={removeCarFromList} />
    ))
     ) : (
        <div></div>
      )}    
      </div>
      <Footer />
    </div>
  );
};

export default ApproveCarPage;
