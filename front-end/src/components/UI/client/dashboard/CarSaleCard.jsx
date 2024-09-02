import React from "react";
import { useParams,Link } from "react-router-dom";

const CarSaleCard = ({ car, removeCarFromList }) => {
  const { id: clientId } = useParams();
  const carId = car.id;
  const carPhoto = car.photo;
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

  return (
    <div className="card mb-4">
      <div className="row g-0">
        <div className="col-md-4">
        <div>
        <img
            src={car.photo ? `data:image/png;base64,${car.photo}` : 'default-image-url'}
            alt="Car"
            className="card-img"
            style={{
              height: "200px",
              backgroundColor: "#ccc",
              backgroundImage: `url(${car.photo || 'default-image-url'})`,
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
            }}
          />  
</div>
          <p>{`${car.brandName} ${car.modelName} ${car.year}`}</p>
</div>
<div className="col-md-8">
  <div className="card-body">
    <h5 className="card-title">Car Information</h5>
    <div className="row">
      <div className="col-md-6">
       <p className="card-text">{`usage status: ${car.usageStatus}`}</p>
        <p className="card-text">{`Car brand: ${car.brandName}`}</p>
        <p className="card-text">{`Car model: ${car.modelName}`}</p>
        <p className="card-text">{`Year: ${car.year}`}</p>
      </div>
      <div className="col-md-6">
      <p className="card-text">{`Phone number: ${car.phoneNumber}`}</p>
        <p className="card-text">{`Price: ${car.price}`}</p>
        <p className="card-text">{`Region: ${car.region}`}</p>
        <p className="card-text">{`Mileage: ${car.mileage}`} km</p>
      </div>
    </div>
    <div className="d-flex justify-content-end mt-3">
              <Link to={`/client/${clientId}/change_auto/${carId}`} className="btn btn-primary me-2">
              Change Car information
              </Link>
              <button className="btn btn-danger" onClick={() => handleRemoveCarSubmit(carId)}>
                Remove Car
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarSaleCard;
