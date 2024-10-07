import React from "react"; 
import { Link } from "react-router-dom";


const ManagerSaleCar = ({ car }) => {
  const id = localStorage.getItem("id");

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
              <Link to={`/manager/${id}/car/${car.id}`} className="dropdown-item" >
              <button className="btn btn-primary">
                Details
              </button>
              </Link>
              </div> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerSaleCar;
