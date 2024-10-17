import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import Header from "../../UI/manager/Header";
import Footer from "../../UI/manager/Footer";

const ManagerSaleCar = () => {
  const [car, setCarData] = useState([]);
  const managerId = localStorage.getItem("id");
  const { carId: carId } = useParams();
  const jwtStr = localStorage.getItem('jwtToken');

  useEffect(() => {
    const fetchCarData = async () => {
      const url = `http://localhost:8080/vehicles/${carId}/info`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtStr
          },
          credentials: "include",
        });
        const car = await response.json();
        setCarData(car);
    };
    fetchCarData();
  }, [managerId]);

  return (
    <div className="body">
      <Header />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mb-4">
            <div
  className="card-img">
    <img
            src={car.photo ? `data:image/png;base64,${car.photo}` : 'default-image-url'}
            alt="Car"
            className="card-img"
            style={{
              height: "390px",
              backgroundColor: "#ccc",
              backgroundImage: `url(${car.photo})`,
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
            }}
          />  
</div>
              
              <div className="card-body text-center">
                <h5 className="card-title">{`${car.brandName} ${car.modelName} ${car.year}`}</h5>
              </div>
              <div className="row ms-4">
                <p className="card-text">{`Car brand: ${car.brandName}`}</p>
                <p className="card-text">{`Car model: ${car.modelName}`}</p>
                <p className="card-text">{`Usage status: ${car.usageStatus}`}</p>
                <p className="card-text">{`Year: ${car.year}`}</p>
                <p className="card-text">{`Phone number: ${car.phoneNumber}`}</p>
                <p className="card-text">{`Price: ${car.price}`}</p>
                <p className="card-text">{`Region: ${car.region}`}</p>
                <p className="card-text">{`Mileage: ${car.mileage} km`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManagerSaleCar;
