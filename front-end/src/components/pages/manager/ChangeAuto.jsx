import React, { useState, useEffect } from "react";
import Header from "../../UI/manager/Header";
import Footer from "../../UI/manager/Footer";
import CarFilterField from "../../UI/client/fields/CarFilterField";
import CarState from "../../UI/client/fields/CarState";
import { useParams, useNavigate } from "react-router-dom";

const ManagerChangeAuto = () => {
  const { carId: carId } = useParams();
  const [photo, setCarPhoto] = useState(null);
  const navigate = useNavigate();
  const jwtStr = localStorage.getItem('jwtToken');

  const [carData, setCarData] = useState({
    brandName: "",
    modelName: "",
    region: "",
    year: "",
    mileage: "",
    price: "",
    gearbox: "",
    phoneNumber: "",
    photo: "",    
    usageStatus: ""
  });
  
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
        setCarPhoto(car.photo)
    };
    fetchCarData();
  });
  
  const handleSave = async () => {
    const url = `http://localhost:8080/vehicles`;
    const car = {
      brandName: carData.brandName,
      modelName: carData.modelName,
      region: carData.region,
      year: carData.year,
      mileage: carData.mileage,
      price: carData.price,
      gearbox: carData.gearbox,
      phoneNumber: carData.phoneNumber,
      usageStatus: carData.usageStatus,
      photo: photo && !isBase64(photo) ? await convertImageToBase64(photo) : photo,
    };
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + jwtStr
      },
      credentials: "include",
      body: JSON.stringify(car),
    });
    setCarPhoto(photo);
    navigate(`/manager/users`);
  };

  const isBase64 = (str) => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };
  

const convertImageToBase64 = (image) => {
  return new Promise((resolve, reject) => {
    if (typeof image === 'string') {
      fetch(image)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    } else if (image instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(image);
    } else {
      reject(new Error('Invalid image type'));
    }
  });
};

  return (
    <div className="body">
      <Header />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6"> 
<div
    className="card-img"
    style={{
      height: "390px",
      backgroundColor: "#ccc",
      backgroundImage: `url(${photo})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {photo && (
      <img
      src={photo ? `data:image/png;base64,${photo}` : 'default-image-url'}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    )}
  </div>
  <div className="mt-3">
    <label htmlFor="carPhoto" className="form-label">
      Add car photo
    </label>
    <input
      type="file"
      className="form-control"
      id="carPhoto"
      accept="image/*"
      onChange={(e) => {
        const imageUrl = URL.createObjectURL(e.target.files[0]);
        setCarPhoto(imageUrl);
      }}
    />
  </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Add Auto</h5> 
                <CarState selectedRadio={carData.usageStatus} onRadioChange={(usageStatus) => setCarData({ ...carData, usageStatus })} />
                  <div className="row ">
                    <div className="col-md-6">
                      <CarFilterField
                        type="text"
                        value={carData.brandName}
                        onChange={(e) =>
                          setCarData({ ...carData, brandName: e.target.value })
                        }
                        placeholder="Car brand"
                      />
                    </div>
                    <div className="col-md-6">
                      <CarFilterField
                        type="text"
                        value={carData.modelName}
                        onChange={(e) =>
                          setCarData({ ...carData, modelName: e.target.value })
                        }   
                        placeholder="Car model"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">

                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <CarFilterField
                        type="text"
                        value={carData.year}
                        onChange={(e) =>
                          setCarData({ ...carData, year: e.target.value })
                        }                         
                         placeholder="Year"
                      />
                    </div>
                    <div className="col-md-6">
                      <CarFilterField
                        type="text"
                        value={carData.price}
                        onChange={(e) =>
                          setCarData({ ...carData, price: e.target.value })
                        }                         
                        placeholder="Price"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <CarFilterField
                        type="text"
                        value={carData.gearbox}
                        onChange={(e) =>
                          setCarData({ ...carData, gearbox: e.target.value })
                        }                         
                        placeholder="Gearbox type"
                      />
                    </div> 
                    <div className="col-md-6 mb-3">
                      <CarFilterField
                        type="text"
                        value={carData.mileage}
                        onChange={(e) =>
                          setCarData({ ...carData, mileage: e.target.value })
                        }                        
                        placeholder="Mileage"
                      />
                    </div> 
                    
                    <div className="col-md-6">
                      <CarFilterField
                        type="text"
                        value={carData.region}
                        onChange={(e) =>
                          setCarData({ ...carData, region: e.target.value })
                        }
                        placeholder="Region"
                      />
                    </div>

                    <div className="col-md-6">
                      <CarFilterField
                        type="text"
                        value={carData.phoneNumber}
                        onChange={(e) =>
                          setCarData({ ...carData, phoneNumber: e.target.value })
                        }
                        placeholder="PhoneNumber"
                      />
                    </div>
                  </div>
                    <button type="submit" className="btn btn-primary" onClick={() => handleSave()}>
                      Save Auto
                    </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManagerChangeAuto;
