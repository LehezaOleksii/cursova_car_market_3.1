
import CarFilterField from "../../UI/client/fields/CarFilterField";
import React, { useState, useEffect } from "react";
import Header from "../../UI/client/Header";
import Footer from "../../UI/client/Footer";
import CarState from "../../UI/client/fields/CarState";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";

const AddAuto = () => {
  const { id: clientId } = useParams();
  const [selectedRadio, setSelectedRadio] = useState("NEW");
  const [photo, setCarPhoto] = useState(null);
  const navigate = useNavigate();
  const jwtStr = localStorage.getItem("jwtToken");

  const [brandName, setCarBrand] = useState(null);
  const [modelName, setCarModel] = useState(null);
  const [region, setRegion] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [price, setPrice] = useState("");
  const [gearbox, setGearbox] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [engine, setEngine] = useState("");

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);
  const [engines, setEngines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsResponse, bodyTypesResponse] = await Promise.all([
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
        ]);
        const brandsData = await brandsResponse.json();
        const bodyTypesData = await bodyTypesResponse.json();
        setBrands(
          brandsData.map((brand) => ({ value: brand, label: brand }))
        );
        setBodyTypes(
          bodyTypesData.map((bodyType) => ({
            value: bodyType,
            label: bodyType,
          }))
        );
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
          setModels(
            modelsData.map((model) => ({ value: model, label: model })) 
          );
        } catch (error) {
          console.error("Error fetching models:", error);
        }
      };

      fetchModels();
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
          setEngines(
            enginesData.map((engine) => ({ value: engine, label: engine })) 
          );
        } catch (error) {
          console.error("Error fetching engines:", error);
        }
      };

      fetchEngines();
    }
  }, [modelName, jwtStr]);

  const handleSubmit = async () => {
    if (!/^\d+$/.test(price) || !/^\d+$/.test(mileage) || !/^\d+$/.test(year)) {
      alert("Price, Mileage, and Year should contain only numeric values.");
      return;
    }

    const car = {
      brandName: brandName?.value,
      modelName: modelName?.value,
      region,
      year,
      mileage,
      price,
      gearbox,
      phoneNumber,
      photo: photo ? await convertImageToBase64(photo) : null,
      usageStatus: selectedRadio,
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
        navigate(`/client/${clientId}`);
      } else {
        console.error("Error adding car:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const convertImageToBase64 = (image) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(image);
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
                  const imageFile = e.target.files[0];
                  setCarPhoto(imageFile);
                }}
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
                      placeholder="Select brand"
                    />
                  </div>
                  <div className="col-md-6">
                    <Select
                      value={modelName}
                      onChange={setCarModel}
                      options={models}
                      placeholder="Select model" 
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <Select
                      value={bodyType}
                      onChange={setBodyType}
                      options={bodyTypes}
                      placeholder="Select Body Type"
                    />
                  </div>
                  <div className="col-md-6">
                    <Select
                      value={engine}
                      onChange={setEngine}
                      options={engines}
                      placeholder="Select engine"
                    />
                  </div>
                  </div>
                  <div className="row mb-3">
                  <div className="col-md-6">
                    <CarFilterField
                      type="text"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="Year"
                    />
                  </div>
                  <div className="col-md-6">
                    <CarFilterField
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Price"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <CarFilterField
                      type="text"
                      value={gearbox}
                      onChange={(e) => setGearbox(e.target.value)}
                      placeholder="Gearbox type"
                    />
                  </div>
                  <div className="col-md-6">
                    <CarFilterField
                      type="text"
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      placeholder="Mileage"
                    />
                  </div>
                  <div className="col-md-6">
                    <CarFilterField
                      type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="Region"
                    />
                  </div>
                  <div className="col-md-6">
                    <CarFilterField
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <Select
                      value={gearbox}
                      onChange={(e) => setGearbox(e?.value)}
                      options={bodyTypes}
                      placeholder="Select Body Type"
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddAuto;
