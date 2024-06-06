import React, {useState, useEffect} from "react";  
import { useParams } from "react-router";
import ApproveCar from "../../UI/manager/approveCar/ApproveCar";
import Header from "../../UI/manager/Header";
import Footer from "../../UI/manager/Footer";

const ApproveCarPage = () => {

  const { id: managerId } = useParams();
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:8080/managers/${managerId}/vehicles/to_approve`;
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
      <div className="p-5">
    {cars.length > 0 ? (
    cars.map((car) => (
      <ApproveCar key={car.id} car={car} id={managerId} removeCarFromList={removeCarFromList} />
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
