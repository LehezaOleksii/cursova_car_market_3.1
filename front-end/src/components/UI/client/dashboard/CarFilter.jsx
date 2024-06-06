import React, { useState } from "react";
import CarStateFilter from "../fields/CarStateFilter";
import CarFilterField from "../fields/CarFilterField";

const CarFilter = ({ onFilter }) => {
  const [carBrand, setCarBrand] = useState("");
  const [carModel, setCarModel] = useState("");
  const [region, setRegion] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [gearbox, setGearbox] = useState("");
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
  const handleGearboxChange = (e) => {
    setGearbox(e.target.value);
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

    if (gearbox) {
      carData.gearbox = gearbox;
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
            value={gearbox}
            onChange={handleGearboxChange}
            placeholder="Gearbox type"
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
          <button
            className="btn btn-primary w-100"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarFilter;
