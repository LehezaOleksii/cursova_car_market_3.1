import React, {useState, useEffect} from "react";
import CarFilter from "../../UI/client/dashboard/CarFilter";
import SaledCars from "../../UI/client/dashboard/SaledCars";
import BrandsFilter from "../../UI/client/dashboard/BrandsFilter";
import Header from "../../UI/manager/Header";
import Footer from "../../UI/manager/Footer";

const Dashboard = () => {
  const [cars, setCars] = useState([]);
  const jwtStr = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:8080/clients/vehicles/${carId}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtStr
          },
        });
      const data = response.json();
      setCars(data)
    };;
    fetchData();
  });

  const filterCars = async (filterData) => {
    const queryParams = new URLSearchParams(filterData);
    const url = `http://localhost:8080/clients/vehicles/filter?${queryParams.toString()}`;
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
  
  return (
    <div className="body">
      <Header />
      <div className="dashboard">
      <CarFilter onFilter={filterCars}/>
      <SaledCars cars={cars}/>
      {/* <BrandsFilter /> */}
      </div>
      <Footer />
    </div>
  )
};

export default Dashboard;
