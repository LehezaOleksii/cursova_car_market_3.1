import React, {useState, useEffect} from "react";
import CarFilter from "../../UI/client/dashboard/CarFilter";
import Header from "../../UI/manager/Header";
import Footer from "../../UI/manager/Footer";
import ManagerSaledCars from "../../UI/manager/ManagerSaledCars";

const ManagerViewCars = () => {

  const clientId = localStorage.getItem("id");
  const [cars, setCars] = useState([]);
  const jwtStr = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchData = async () => {

      const url = `http://localhost:8080/vehicles`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + jwtStr
        },
        credentials: "include",
      });

      const data = await response.json();
      setCars(data);
    };
    fetchData();
  }, [clientId]);

  const filterCars = async (filterData) => {
    const queryParams = new URLSearchParams(filterData);
    const url = `http://localhost:8080/vehicles/filter?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + jwtStr
      },
      credentials: "include",
    });

    const data = await response.json();
    setCars(data);
  };
  

  return (
    <div className="body">
      <Header />
      <div className="dashboard">
      <CarFilter onFilter={filterCars}/>
      <ManagerSaledCars cars={cars}/>
      {/* <BrandsFilter /> */} 
      </div>
      <Footer />
    </div>
  )
};

export default ManagerViewCars;
