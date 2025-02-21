import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import gearboxIcon from '../../../../resources/gearbox.png';
import canisterIcon from '../../../../resources/canister.png';
import "./car_style.css";
import "../dashboard/dashboard.css"


const DashboardCar = ({ car }) => {
  const [liked, setLiked] = useState(car.userLiked || false)
  const [likes, setLikes] = useState(Number(car.likes));
  const jwtStr = localStorage.getItem("jwtToken");
  const [exchangeRate, setExchangeRate] = useState(null);
  const navigate = useNavigate();

  const handleLikeToggle = async () => {
    const url = liked
      ? `http://localhost:8080/vehicles/${car.id}/like/false`
      : `http://localhost:8080/vehicles/${car.id}/like/true`;

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

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('http://localhost:8080/exchanges?CurrencyShortNameA=USD&CurrencyShortNameB=UAH', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtStr,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setExchangeRate(parseFloat(data.data));
        } else {
          console.error("Failed to fetch exchange rate");
        }
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };
    fetchExchangeRate();
  }, [jwtStr]);

  const priceInUAH = exchangeRate ? Number((car.price * exchangeRate).toFixed(0)) : null;

  const handleSendMessage = async () => {
    try {
      const response = await fetch(`http://localhost:8080/users/id/vehicleId/${car.id}`, {
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
    <div className="card mb-4 box-shadow-12 br16">
      <div className="row g-0 mt-3">
        <div className="col-md-5">
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
                width: "360px",
                objectFit: "cover",
                borderRadius: "16px",
                marginLeft: "16px"
              }}
            />
          </div>
        </div>
        <div className="col-md-7">
          <div className="card-body">
            <h5 className="card-title">{car.modelName} {car.year}</h5>
            <div>
              <h5 className="card-title" style={{ color: "#228B22", fontSize: "22px", fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>
                {car.price.toLocaleString("en-US").replace(/,/g, " ")} $
                {priceInUAH && (
                  <>
                    <span style={{ color: "grey", fontSize: "16px", fontFamily: "Arial, sans-serif", fontWeight: "normal", marginLeft: "5px" }}>
                      {" • "}
                    </span>
                    <span style={{ color: "grey", fontSize: "16px", fontFamily: "Arial, sans-serif", fontWeight: "normal", marginLeft: "5px" }}>
                      {priceInUAH.toLocaleString("en-US").replace(/,/g, " ")} ₴
                    </span>
                  </>
                )}
              </h5>
            </div>
            <div className="row">
              <div className="col-md-6">
                <p className="card-text car-field">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-speedometer" viewBox="0 0 16 16" style={{ marginRight: "10px" }}>
                    <path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2M3.732 3.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707M2 8a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8m9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5m.754-4.246a.39.39 0 0 0-.527-.02L7.547 7.31A.91.91 0 1 0 8.85 8.569l3.434-4.297a.39.39 0 0 0-.029-.518z" />
                    <path fill-rule="evenodd" d="M6.664 15.889A8 8 0 1 1 9.336.11a8 8 0 0 1-2.672 15.78zm-4.665-4.283A11.95 11.95 0 0 1 8 10c2.186 0 4.236.585 6.001 1.606a7 7 0 1 0-12.002 0" />
                  </svg>
                  {`${car.mileage.toLocaleString("en-US").replace(/,/g, " ")} km`}
                </p>
                <p className="card-text car-field">
                  <img src={canisterIcon
                  } alt="icon" width="18" height="18" style={{ marginRight: "10px" }} />
                  {`${car.engine}`}
                </p>
              </div>
              <div className="col-md-6">
                <p className="card-text car-field">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16" style={{ marginRight: "10px" }}>
                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                  </svg>
                  {`${car.region}`}
                </p>
                <p className="card-text car-field">
                  <img src={gearboxIcon} alt="icon" width="16" height="16" style={{ marginRight: "10px" }} />
                  {`${car.gearbox}`}
                </p>
              </div>
            </div>
            <div className="mt-3 d-flex justify-content-between align-items-center">
              <p className="card-text mb-0">
                {`views ${car.views} `}<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                </svg>
                {` favorietes ${likes}`}
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
              <div className="d-flex">
                <Link to={`/car/${car.id}`} className="dropdown-item">
                  <button className="btn btn-primary me-2 box-shadow-12">Details</button>
                </Link>
                <div className="dropdown-item box-shadow-12 ">
                  <button className="btn btn-secondary" onClick={handleSendMessage}>Send Message</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCar;
