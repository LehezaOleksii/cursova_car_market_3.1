
import CarFilterField from "../../UI/client/fields/CarFilterField";
import React, { useState, useEffect } from "react";
import Header from "../../UI/client/Header";
import Footer from "../../UI/client/Footer";
import CarState from "../../UI/client/fields/CarState";
import {useNavigate } from "react-router-dom";
import Select from "react-select";


const AddAuto = () => {

  const id = localStorage.getItem("id");
  const [selectedRadio, setSelectedRadio] = useState("NEW");
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const handlePhotoChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + photos.length <= 20) {
      setPhotos((prevPhotos) => [...prevPhotos, ...selectedFiles]);
    } else {
      alert("You can only upload up to 20 photos.");
    }
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };
  
  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };
  

  const navigate = useNavigate();
  const jwtStr = localStorage.getItem("jwtToken");

  const [brandName, setCarBrand] = useState(null);
  const [modelName, setCarModel] = useState(null);
  const [region, setRegion] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [price, setPrice] = useState("");
  const [gearbox, setGearbox] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [engine, setEngine] = useState("");
  const [description, setDescription] = useState("");

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);
  const [engines, setEngines] = useState([]);
  const [gearboxes, setGearboxes] = useState([]);
  const [regions, setRegions] = useState([]);

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPrice(formatPrice(value));
  };

  const formatPrice = (value) => {
    const onlyNumbers = value.replace(/\D/g, "");
    return onlyNumbers ? `$${parseInt(onlyNumbers, 10).toLocaleString()}` : "";
  };

  const formatPhoneNumber = (value) => {
    const onlyDigits = value.replace(/\D/g, "");
    if (onlyDigits.length > 13) {
      return onlyDigits.slice(0, 13);
    }

    let formattedNumber = "";
    if (onlyDigits.length > 0) {
      formattedNumber += "+380 ";
    }
    if (onlyDigits.length > 3) {
      formattedNumber += onlyDigits.slice(3, 5) + " ";
    }
    if (onlyDigits.length > 5) {
      formattedNumber += onlyDigits.slice(5, 8) + " ";
    }
    if (onlyDigits.length > 8) {
      formattedNumber += onlyDigits.slice(8, 12);
    }
    return formattedNumber.trim();
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    const formattedPhoneNumber = formatPhoneNumber(value);
    setPhoneNumber(formattedPhoneNumber);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsResponse, bodyTypesResponse, gearboxesResponse, regionsResponse] = await Promise.all([
          fetch(`http://localhost:8080/vehicles/brands`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwtStr,
            },
          }),
          fetch(`http://localhost:8080/vehicles/body-types`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwtStr,
            },
          }),
          fetch(`http://localhost:8080/vehicles/gearboxes`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwtStr,
            },
          }),
          fetch(`http://localhost:8080/cities`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwtStr,
            },
          }),
        ]);

        const brandsData = await brandsResponse.json();
        const bodyTypesData = await bodyTypesResponse.json();
        const gearboxesData = await gearboxesResponse.json();
        const regionsData = await regionsResponse.json();

        setBrands(brandsData.map((brand) => ({ value: brand, label: brand })));
        setBodyTypes(bodyTypesData.map((bodyType) => ({ value: bodyType, label: bodyType })));
        setGearboxes(gearboxesData.map((gearbox) => ({ value: gearbox, label: gearbox })));
        setRegions(regionsData.map((region) => ({ value: region, label: region })));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [jwtStr]);

  useEffect(() => {
    if (brandName) {
      const fetchModels = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/vehicles/brands/${brandName.value}/models`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + jwtStr,
              },
            }
          );
          const modelsData = await response.json();
          setModels(modelsData.map((model) => ({ value: model, label: model })));
          setCarModel(null);
          setEngine(null);
        } catch (error) {
          console.error("Error fetching models:", error);
        }
      };

      fetchModels();
    } else {
      setModels([]);
      setCarModel(null);
      setEngine(null);
    }
  }, [brandName, jwtStr]);

  useEffect(() => {
    if (modelName) {
      const fetchEngines = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/vehicles/brands/models/${modelName.value}/engines`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + jwtStr,
              },
            }
          );
          const enginesData = await response.json();
          setEngines(enginesData.map((engine) => ({ value: engine, label: engine })));
          setEngine(null);
        } catch (error) {
          console.error("Error fetching engines:", error);
        }
      };

      fetchEngines();
    } else {
      setEngines([]);
      setEngine(null);
    }
  }, [modelName, jwtStr]);

  const handleSubmit = async () => {
    const yearNum = parseInt(year, 10);

    if (!brandName || !modelName || !bodyType || !gearbox || !region || !engine || photos.length==0) {
      alert("Please fill in all required fields: brand, model, body type, gearbox, region, engine, photos.");
      return;
    }

    if (!year || year < 1900 || year > new Date().getFullYear()) {
      alert("Please enter a valid year between 1900 and the current year.");
    return;
    }

    if (!mileage || isNaN(mileage) || mileage < 0) {
      alert("Please enter a valid mileage.");
    return;
    }

    const priceString = price.replace(/\D+/g, '');

    if (!priceString) {
      alert("Please enter a valid price.");
    return;
    }

    const phoneNumberTest = phoneNumber.replace(/\s+/g, '');

    if (!phoneNumberTest || !/^(\+38)?(0\d{9})$/.test(phoneNumberTest)) {
      alert("Please enter a valid Ukrainian phone number.");
      return;
    }
    const base64Photos = await convertImagesToBase64(photos);

    const car = {
      photos: base64Photos,
      brandName: brandName?.value,
      modelName: modelName?.value,
      region: region?.value,
      year: yearNum,
      mileage: mileage,
      price: priceString.replace(/\D/g, ""),
      gearbox: gearbox?.value,
      phoneNumber: phoneNumber,
      bodyType: bodyType?.value,
      engine: engine?.value,
      usageStatus: selectedRadio,
      description: description
    };

    try {
      const response = await fetch(`http://localhost:8080/vehicles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtStr,
        },
        body: JSON.stringify(car),
      });

      if (response.ok) {
        navigate(`/client`);
      } else {
        console.error("Error adding car:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const convertImagesToBase64 = (images) => {
    const promises = images.map((image) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });
    });
    return Promise.all(promises);
  };

  return (
    <div className="body">
      <Header />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6">
            <div className="card-img" style={{ height: "350px", position: "relative", overflow: "hidden", borderRadius: "10px", border: "1px solid #ddd" }}>
              {photos.length > 0 ? (
                <img
                  src={URL.createObjectURL(photos[currentPhotoIndex])}
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
              <button onClick={prevPhoto} disabled={photos.length === 0} className="btn btn-secondary">
                &lt; Previous
              </button>
              <button onClick={nextPhoto} disabled={photos.length === 0} className="btn btn-secondary">
                Next &gt;
              </button>
            </div>
            <div className="mt-3">
              <label htmlFor="carPhotos" className="form-label">
                Add car photos (max 20)
              </label>
              <input
                type="file"
                className="form-control"
                id="carPhotos"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
              />
            </div>
          </div> 
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Add Auto</h5>
                <CarState
                  selectedRadio={selectedRadio}
                  onRadioChange={setSelectedRadio}
                />
                <div className="row mb-3">
                  <div className="col-md-6">
                    <Select
                      value={brandName}
                      onChange={setCarBrand}
                      options={brands}
                      placeholder="Select Brand"
                    />
                  </div>
                  <div className="col-md-6">
                    <Select
                      value={bodyType}
                      onChange={setBodyType}
                      options={bodyTypes}
                      placeholder="Select Body Type"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <Select
                      value={modelName}
                      onChange={setCarModel}
                      options={models}
                      placeholder="Select Model"
                    />
                  </div>
                  <div className="col-md-6">
                    <Select
                      value={engine}
                      onChange={setEngine}
                      options={engines}
                      placeholder="Select Engine"
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <Select
                      value={gearbox}
                      onChange={setGearbox}
                      options={gearboxes}
                      placeholder="Select Gearbox"
                    />
                  </div>
                  <div className="col-md-6">
                    <CarFilterField
                      type="text"
                      value={year}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d{0,4}$/.test(value)) {
                          setYear(value);
                        }
                      }}
                      placeholder="Year"
                    />
                  </div>
                  <div className="col-md-6">
                    <Select
                      value={region}
                      onChange={setRegion}
                      options={regions}
                      placeholder="Select Region"
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
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      placeholder="Phone Number"  
                    />
                  </div>
                  <div className="col-md-6">
                    <CarFilterField
                      type="number"
                      className="form-control"
                      placeholder="Mileage (in km)"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Save Auto
                </button>
              </div>
            </div>
            <div className="card mt-3">
            <div className="card-body">
              <h5 className="card-title">Description</h5>
              <textarea
                className="form-control"
                rows="4"
                value={description}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 250) {
                    setDescription(value);
                  }
                }}
                placeholder="Enter car description..."
              />
              <small className="text-muted">
                {description.length}/250 characters
              </small>
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
