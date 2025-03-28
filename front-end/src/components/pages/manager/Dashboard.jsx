import React, {useState, useEffect} from "react";
import CarFilter from "../../UI/client/dashboard/CarFilter";
import SaledCars from "../../UI/client/dashboard/SaledCars";
import WrappedHeader from "../../WrappedHeader";
import WrappedFooter from "../../WrappedFooter";

const Dashboard = () => {
  const [cars, setCars] = useState([]);
  const jwtStr = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchData = async () => {
      const url = `/vehicles/${carId}/info`;
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
    filterData.vehicleStatus = "POSTED";
    const queryParams = new URLSearchParams(filterData);
    const url = `/vehicles/filter?${queryParams.toString()}`;
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
      <WrappedHeader />
      <div className="dashboard">
      <CarFilter onFilter={filterCars}/>
      <SaledCars cars={cars}/>
      </div>
      <WrappedFooter />
    </div>
  )
};

export default Dashboard;
