import React from "react";
import { Link } from "react-router-dom";

const CarSaleCard = ({ car, removeCarFromList }) => {
  const clientId = localStorage.getItem("id");
  const carId = car.id;
  const jwtStr = localStorage.getItem('jwtToken');

  const handleRemoveCarSubmit = async (carId) => {
    const url = `http://localhost:8080/clients/${clientId}/vehicles/${carId}/remove`;
    await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtStr
      },
      credentials: "include",
    });
    removeCarFromList(carId);
  };

  const getStatusBadgeColor = () => {
    return car.status === "POSTED" ? "bg-success text-white" : "bg-warning text-white";
  };

  return (
    <div className="card mb-4">
      <div className="row g-0">
        <div className="col-md-4">
          <div>
          <img
            src={car.photos ? `data:image/png;base64,${car.photos[0]}` : 'default-image-url'}
            alt="Car"
            className="card-img"
            style={{
              height: "220px",
              backgroundColor: "#ccc",
              backgroundImage: `url(${car.photo || 'default-image-url'})`,
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
              borderRadius: "15px", 
            }}
          />
          </div>
          <p>{`${car.modelName} ${car.year}`}</p>
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">Car Information</h5>
            <div className="row">
              <div className="col-md-6">
                <p className="card-text">{`Usage Status: ${car.usageStatus}`}</p>
                <p className="card-text">{`Car Brand: ${car.brandName}`}</p>
                <p className="card-text">{`Car Model: ${car.modelName}`}</p>
                <p className="card-text">{`Year: ${car.year}`}</p>
              </div>
              <div className="col-md-6">
                <p className="card-text">{`Phone Number: ${car.phoneNumber}`}</p>
                <p className="card-text">{`Price: $${car.price}`}</p>
                <p className="card-text">{`Region: ${car.region}`}</p>
                <p className="card-text">{`Mileage: ${car.mileage} km`}</p>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span className={`badge ${getStatusBadgeColor()}`}>{`Status: ${car.status}`} statistics-</span>
              <div>
                <Link to={`/client/change_auto/${carId}`} className="btn btn-primary me-2">
                  Change Car Information
                </Link>
                <button className="btn btn-danger" onClick={() => handleRemoveCarSubmit(carId)}>
                  Remove Car
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarSaleCard;
