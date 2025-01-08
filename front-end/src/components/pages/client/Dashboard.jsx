import React, {useState, useEffect} from "react";
import CarFilter from "../../UI/client/dashboard/CarFilter";
import SaledCars from "../../UI/client/dashboard/SaledCars";
import Header from "../../UI/client/Header";
import Footer from "../../UI/client/Footer";

const Dashboard = () => {
  
  const [cars, setCars] = useState([]);
  const jwtStr = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchData = async () => {
        const url = `http://localhost:8080/vehicles`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
          credentials: 'include',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtStr
          }
        });
        if (response.ok) {
          const data = await response.json();
          setCars(data.content);
        } else {
          console.error("Failed to fetch cars:", response.status);
        }        
    };
    fetchData();
  }, [jwtStr]); 

  return (
    <div className="body">
      <Header />
      <div className="dashboard">
      <CarFilter setCars={setCars} /> 
           <SaledCars cars={cars} />
</div>
      <Footer />
    </div>
  )
};

export default Dashboard;
