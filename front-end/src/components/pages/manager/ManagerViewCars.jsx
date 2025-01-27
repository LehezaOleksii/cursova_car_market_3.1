import React, {useState, useEffect} from "react";
import CarFilter from "../../UI/client/dashboard/CarFilter";
import WrappedHeader from "../../WrappedHeader";
import WrappedFooter from "../../WrappedFooter";
import ManagerSaledCars from "../../UI/manager/ManagerSaledCars";

const ManagerViewCars = () => {

  const clientId = localStorage.getItem("id");
  const [cars, setCars] = useState([]);
  const jwtStr = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchData = async () => {

      const url = `http://localhost:8080/vehicles/posted`;
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
    filterData.vehicleStatus = "POSTED";
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
      <WrappedHeader />
      <div className="dashboard">
      <CarFilter onFilter={filterCars}/>
      <ManagerSaledCars cars={cars}/>
      {/* <BrandsFilter /> */} 
      </div>
      <WrappedFooter />
    </div>
  )
};

export default ManagerViewCars;
