import React, { useState } from "react";
import CarStateFilter from "../fields/CarStateFilter";
import CarFilterField from "../fields/CarFilterField";

const CarFilter = ({ onFilter }) => {
  const [carBrand, setCarBrand] = useState("");
  const [carModel, setCarModel] = useState("");
  const [region, setRegion] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [mileage, setMileage] = useState("");
  const [carState, setCarState] = useState("ALL");

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
  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };
  const handleMileageChange = (e) => {
    setMileage(e.target.value);
  };
  const handleRadioChange = (selectedValue) => {
    setCarState(selectedValue);    
  };

  const isNumeric = (value) => /^\d+$/.test(value);

  const handleSearch = () => {
    const carData = {};

    if (carBrand) {
      carData.carBrand = carBrand;
    }

    if (carModel) {
      carData.carModel = carModel;
    }

    if (region) {
      carData.region = region;
    }

    carData.carState = carState;

    onFilter(carData);
  };
  

  return (
    <div className="card mt-3 mb-5 p-3">
      <h5 className="card-title mb-2">Car Filter</h5>
      <CarStateFilter onRadioChange={handleRadioChange} />
      <div className="row">
        <div className="col-md-6">
          <CarFilterField
            type="text"
            value={carBrand}
            onChange={handleCarBrandChange}
            placeholder="Car brand"
          />
        </div>
        <div className="col-md-6">
          <CarFilterField
            type="text"
            value={carModel}
            onChange={handleCarModelChange}
            placeholder="Car model"
          />
        </div>
      </div>
      <div className="row">
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
            value={mileage}
            onChange={handleMileageChange}
            placeholder="Mileage"
          />
        </div>
      </div>
      <div className="row">
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
      <div className="row">
      <div className="row">
  <div className="col-md-6 mx-auto">
    <button
      className="btn btn-primary w-100"
      onClick={handleSearch}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="currentColor"
        className="bi bi-search"
        viewBox="0 0 18 18"
      >
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
      </svg>
      Search
    </button>
  </div>
</div>
      </div>
    </div>
  );
};

export default CarFilter;
