import React from "react";
import { Link } from "react-router-dom";

const DashboardCar = ({ car }) => {
  const id = localStorage.getItem("id");

  return (
    <div className="card mb-4">
      <div className="row g-0">
        <div className="col-md-4">
          <div>
            <img
              src={
                car.photos && car.photos.length > 0
                  ? `data:image/png;base64,${car.photos[0]}`
                  : "default-image-url"
              }
              alt="Car"
              style={{
                height: "200px",
                width: "100%",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </div>
          <p className="mt-2">{`${car.modelName} ${car.year}`}</p>
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">Car Information</h5>
            <div className="row">
              <div className="col-md-6">
                <p className="card-text">{`Car brand: ${car.brandName}`}</p>
                <p className="card-text">{`Car model: ${car.modelName}`}</p>
                <p className="card-text">{`Year: ${car.year}`}</p>
                <p className="card-text">{`Usage status: ${car.usageStatus}`}</p>
              </div>
              <div className="col-md-6">
                <p className="card-text">{`Phone number: ${car.phoneNumber}`}</p>
                <p className="card-text">{`Price: ${car.price}`}</p>
                <p className="card-text">{`Region: ${car.region}`}</p>
                <p className="card-text">{`Mileage: ${car.mileage}`} km</p>
              </div>
            </div>
            <div className="text-end mt-3">
              <Link to={`/client/car/${car.id}`} className="dropdown-item">
                <button className="btn btn-primary">Details</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCar;
