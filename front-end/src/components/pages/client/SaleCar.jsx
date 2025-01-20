import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import WrappedHeader from "../../WrappedHeader";
import WrappedFooter from "../../WrappedFooter";

const SaleCar = () => {
  const { carId } = useParams(); 
  const navigate = useNavigate();
  const jwtStr = localStorage.getItem("jwtToken");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [car, setCar] = useState(null);

  const nextPhoto = () => {
    if (car && car.photos.length > 0) {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % car.photos.length);
    }
  };

  const prevPhoto = () => {
    if (car && car.photos.length > 0) {
      setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + car.photos.length) % car.photos.length);
    }
  };

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await fetch(`http://localhost:8080/vehicles`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtStr,
          },
        });
        const carData = await response.json();
        setCar(carData);
      } catch (error) {
        console.error("Error fetching vehicle:", error);
      }
    };
    fetchCar();
  }, [jwtStr, carId]);

  return (
    <div className="body">
      <WrappedHeader />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <div
              className="card-img"
              style={{
                height: "350px",
                position: "relative",
                overflow: "hidden",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
            >
              {car && car.photos && car.photos.length > 0 ? (
                <img
                  src={`data:image/jpeg;base64,${car.photos[currentPhotoIndex]}`} // Use Base64 string here
                  alt="Car"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
              ) : (
                <div
                  style={{
                    height: "100%",
                    backgroundColor: "#ccc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#666",
                    fontSize: "18px",
                    fontWeight: "bold",
                    borderRadius: "10px",
                  }}
                >
                  No Photo Available
                </div>
              )}
            </div>
            <div className="d-flex justify-content-between mt-3">
              <button
                onClick={prevPhoto}
                disabled={!car || car.photos.length === 0}
                className="btn btn-secondary"
              >
                &lt; Previous
              </button>
              <button
                onClick={nextPhoto}
                disabled={!car || car.photos.length === 0}
                className="btn btn-secondary"
              >
                Next &gt;
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Car Details</h5>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label>Brand:</label>
                    <p>{car?.brandName || "N/A"}</p>
                  </div>
                  <div className="col-md-6">
                    <label>Body Type:</label>
                    <p>{car?.bodyType || "N/A"}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label>Model:</label>
                    <p>{car?.modelName || "N/A"}</p>
                  </div>
                  <div className="col-md-6">
                    <label>Engine:</label>
                    <p>{car?.engine || "N/A"}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label>Gearbox:</label>
                    <p>{car?.gearbox || "N/A"}</p>
                  </div>
                  <div className="col-md-6">
                    <label>Year:</label>
                    <p>{car?.year || "N/A"}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label>Region:</label>
                    <p>{car?.region || "N/A"}</p>
                  </div>
                  <div className="col-md-6">
                    <label>Price:</label>
                    <p>${car?.price || "N/A"}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label>Phone Number:</label>
                    <p>{car?.phoneNumber || "N/A"}</p>
                  </div>
                  <div className="col-md-6">
                    <label>Mileage (in km):</label>
                    <p>{car?.mileage || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title">Description</h5>
                <p>{car?.description || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WrappedFooter />
    </div>
  );
};
export default SaleCar;
