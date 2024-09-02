import React, { useState } from "react";
import Header from "../../UI/client/Header";
import Footer from "../../UI/client/Footer";
import CarFilterField from "../../UI/client/fields/CarFilterField";
import CarState from "../../UI/client/fields/CarState";
import { useParams, useNavigate } from "react-router-dom";


const AddAuto = () => {
  const { id: clientId } = useParams();
  const [selectedRadio, setSelectedRadio] = useState("NEW");
  const [photo, setCarPhoto] = useState(null);
  const navigate = useNavigate();
  const jwtStr = localStorage.getItem('jwtToken');

  const [brandName, setCarBrand] = useState("");
  const [modelName, setCarModel] = useState("");
  const [region, setRegion] = useState("");
  const [year, setYear] = useState(0);
  const [mileage, setMileage] = useState(0);
  const [price, setPrice] = useState(0);
  const [gearbox, setGearbox] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleCarBrandChange = (e) => {
    setCarBrand(e.target.value);
  };
  const handleCarModelChange = (e) => {
    setCarModel(e.target.value);
  };
  const handleRegionChange = (e) => {
    setRegion(e.target.value);
  };
  const handleYearChange = (e) => {
    setYear(e.target.value);
  };  
  const handleMileageChange = (e) => {
    setMileage(e.target.value);
  };
  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };
  const handleGearboxChange = (e) => {
    setGearbox(e.target.value);
  };
  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = async () => { 

    if (!/^\d+$/.test(price)) {
      alert("Price should contain only numeric values.");
      return;
    }
  
    if (!/^\d+$/.test(mileage)) {
      alert("Mileage should contain only numeric values.");
      return;
    }
  
    if (!/^\d+$/.test(year)) {
      alert("Year should contain only numeric values.");
      return;
    }
    const car = {
      brandName,
      modelName,
      region,
      year,
      mileage,
      price,
      gearbox,
      phoneNumber,
      photo: photo ? await convertImageToBase64(photo) : null,
      usageStatus: selectedRadio,
    };
    
      const url = `http://localhost:8080/clients/${clientId}/vehicle`;
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + jwtStr
        },
        credentials: "include",
        body: JSON.stringify(car),
      });
    
      navigate(`/client/${clientId}`);
    };
    
const convertImageToBase64 = (image) => {
  return new Promise((resolve, reject) => {
    if (typeof image === 'string') {
      // If it's a URL, fetch the image and convert it to base64
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
      // If it's a File object, directly read it as base64
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
      height: "350px",
      backgroundColor: "#ccc",
      backgroundImage: `url(${photo})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {photo && (
      <img
        src={photo}
        alt="Car"
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
                <CarState selectedRadio={selectedRadio} onRadioChange={setSelectedRadio} />
                  <div className="row mb-3">
                    {/* <div className="col-md-6">
                      <CarFilterField
                        type="text"
                        value={vehicleType}
                        onChange={handleVehicleTypeChange}
                        placeholder="Vehicle type"
                      />
                    </div> */}
                    <div className="col-md-6">
                      <CarFilterField
                        type="text"
                        value={brandName}
                        onChange={handleCarBrandChange}
                        placeholder="Car brand"
                      />
                    </div>
                    <div className="col-md-6">
                      <CarFilterField
                        type="text"
                        value={modelName}
                        onChange={handleCarModelChange}
                        placeholder="Car model"
                      />
                    </div>
                  </div>
                  {/* <div className="row mb-3"> */}
                  {/* </div> */}
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <CarFilterField
                        type="text"
                        value={year}
                        onChange={handleYearChange}
                        placeholder="Year"
                      />
                    </div>
                    <div className="col-md-6">
                      <CarFilterField
                        type="text"
                        value={price}
                        onChange={handlePriceChange}
                        placeholder="Price"
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <CarFilterField
                        type="text"
                        value={gearbox}
                        onChange={handleGearboxChange}
                        placeholder="Gearbox type"
                      />
                    </div> 
                    <div className="col-md-6 mb-3">
                      <CarFilterField
                        type="text"
                        value={mileage}
                        onChange={handleMileageChange}
                        placeholder="Mileage"
                      />
                    </div> 

                    <div className="col-md-6">
                      <CarFilterField
                        type="text"
                        value={region}
                        onChange={handleRegionChange}
                        placeholder="Region"
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <CarFilterField
                        type="text"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        placeholder="phoneNumber"
                      />
                    </div>
                    
                  </div>
                    <button type="submit" className="btn btn-primary" onClick={() => handleSubmit()}>
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

export default AddAuto;
