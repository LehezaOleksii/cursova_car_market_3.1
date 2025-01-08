import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DashboardCar = ({ car }) => {
  const [liked, setLiked] = useState(car.userLiked || false)
  const [likes, setLikes] = useState(Number(car.likes));
  const jwtStr = localStorage.getItem("jwtToken");
  const navigate = useNavigate(); 

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

  const handleSendMessage = async () => {
    try {
      const response = await fetch(`http://localhost:8080/clients/id/vehicleId/${car.id}`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + jwtStr
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        navigate(`/chat/${data.data}`);
      } else {
        console.error("Failed to fetch owner information.");
      }
    } catch (error) {
      console.error("Error fetching owner information:", error);
    }
  };

  return (
    <div className="card mb-4">
      <div className="row g-0">
        <div className="col-md-4">
          <div>
            <img
              src={
                car.photo
                  ? `data:image/png;base64,${car.photo}`
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
          </div>
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
                <p className="card-text">{`Mileage: ${car.mileage} km`}</p>
              </div>
            </div>
            <div className="text-end mt-3">
              <Link to={`/client/car/${car.id}`} className="dropdown-item">
                <button className="btn btn-primary">Details</button>
              </Link>
              <div className="dropdown-item">
                <button className="btn btn-secondary" onClick={handleSendMessage}>Send Message</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCar;
