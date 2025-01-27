import {React, useState } from "react";
import { Link } from "react-router-dom";

const CarSaleCard = ({ car, removeCarFromList }) => {
  const carId = car.id;
 const [liked, setLiked] = useState(car.userLiked || false)
  const [likes, setLikes] = useState(Number(car.likes));
  const jwtStr = localStorage.getItem("jwtToken");
  const handleLikeToggle = async () => {
    const url = liked
      ? `http://localhost:8080/vehicles/${car.id}/no_like`
      : `http://localhost:8080/vehicles/${car.id}/like`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtStr
      },
    });
    if (response.ok) {
      setLiked(!liked);
      setLikes((prevLikes) => liked ? Number(prevLikes) - 1 : Number(prevLikes) + 1);
    } else {
      console.error("Failed to update like status.");
    }
  };
  const handleRemoveCarSubmit = async (carId) => {
    const url = `http://localhost:8080/vehicles/${car.id}`;
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
              <span className={`badge ${getStatusBadgeColor()}`}>{`Status: ${car.status}`}</span>
              <div className="mt-3">
            <p className="card-text">
              {`Views: ${car.views}; `}
              {`Likes: ${likes}`}
              <span onClick={handleLikeToggle} style={{ cursor: 'pointer', marginLeft: '10px' }}>
                {liked ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-heart-fill" viewBox="0 0 16 16">
                    <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                  </svg>
                )}
              </span>
            </p>
          </div>              <div>
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
