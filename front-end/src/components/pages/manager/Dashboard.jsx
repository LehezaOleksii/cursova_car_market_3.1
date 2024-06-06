import React, {useState, useEffect} from "react";
import { useParams } from "react-router";
import CarFilter from "../../UI/client/dashboard/CarFilter";
import SaledCars from "../../UI/client/dashboard/SaledCars";
import BrandsFilter from "../../UI/client/dashboard/BrandsFilter";
import Header from "../../UI/manager/Header";
import Footer from "../../UI/manager/Footer";

const Dashboard = () => {
  const { id: managerId } = useParams();
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const url = `http://localhost:8080/clients/${managerId}/vehicles/all`;
      const response = await fetch(url);
      const data = await response.json();
      setCars(data);
    };
    fetchData();
  }, [managerId]);

  const filterCars = async (filterData) => {
    const queryParams = new URLSearchParams(filterData);
    const url = `http://localhost:8080/clients/${managerId}/vehicles/filter?${queryParams.toString()}`;
    const response = await fetch(url);
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
