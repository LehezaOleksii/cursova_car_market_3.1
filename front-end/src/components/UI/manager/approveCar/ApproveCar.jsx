import React from "react";
import { useNavigate, useParams } from "react-router";

const ApproveCar = ({ car, removeCarFromList }) => {

  const { id: managerId } = useParams();
  const jwtStr = localStorage.getItem('jwtToken');
  const navigate = useNavigate();

  const blockCar = async () => {
    const url = `http://localhost:8080/vehicles/${car.id}/disapprove`;
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtStr
      },
      credentials: "include",
    });
    removeCarFromList(car.id);
  };

  const approveCar = async () => {
    const url = `http://localhost:8080/vehicles/${car.id}/approve`;
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtStr
      },
      credentials: "include",
    });
    removeCarFromList(car.id);
  };

  const getDetailsInformation = async () => {
    navigate(`/manager/approve/car/${car.id}`);
  };

  return (
    <div className="card mb-4">
      <div className="row g-0">
        <div className="col-md-4">
          <img
            src={car.photos && car.photos.length > 0
              ? `data:image/png;base64,${car.photos[0]}`
              : 'default-image-url'}
            alt="Car"
            style={{
              height: "260px",
              width: "100%",
              objectFit: "cover",
              borderRadius: "10px"
            }}
          />
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
                <p className="card-text">{`phone number: ${car.phoneNumber}`}</p>
                <p className="card-text">{`Price: ${car.price}`}</p>
                <p className="card-text">{`Region: ${car.region}`}</p>
                <p className="card-text">{`Mileage: ${car.mileage}`} km</p>
              </div>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <div className="d-flex align-items-center">
                <button className="btn btn-primary" onClick={getDetailsInformation}>Details</button>
              </div>
              <div style={{ width: "15px" }}></div>
              <div className="d-flex align-items-center">
                <button className="btn btn-primary" onClick={approveCar}>Approve car</button>
              </div>
              <div style={{ width: "15px" }}></div>
              <div className="d-flex align-items-center">
                <button className="btn btn-danger" onClick={blockCar}>Disapprove car</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveCar;
