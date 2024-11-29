import React, { useState } from "react";
import CarStateFilter from "../fields/CarStateFilter";
import CarFilterField from "../fields/CarFilterField";

const CarFilter = ({ onFilter }) => {
  const [carBrand, setCarBrand] = useState("");
  const [carModel, setCarModel] = useState("");
  const [region, setRegion] = useState("");
  const [gearbox, setGearbox] = useState("");
  const [carState, setCarState] = useState("ALL");
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");
  const [fromPrice, setFromPrice] = useState("");
  const [toPrice, setToPrice] = useState("");

  const handleCarBrandChange = (e) => {
    setCarBrand(e.target.value);
  };

  const handleCarModelChange = (e) => {
    setCarModel(e.target.value);
  };

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
  };

  const handleGearboxChange = (e) => {
    const value = e.target.value;
    if (!value || /^[0-9]*$/.test(value)) {
      setGearbox(value);
    }
  };

  const handleFromYearChange = (e) => {
    const value = e.target.value;
    if (!value || /^[0-9]*$/.test(value)) {
      setFromYear(value);
    }
  };

  const handleToYearChange = (e) => {
    const value = e.target.value;
    if (!value || /^[0-9]*$/.test(value)) {
      setToYear(value);
    }
  };

  const handleFromPriceChange = (e) => {
    const value = e.target.value;
    if (!value || /^[0-9]*$/.test(value)) {
      setFromPrice(value);
    }
  };

  const handleToPriceChange = (e) => {
    const value = e.target.value;
    if (!value || /^[0-9]*$/.test(value)) {
      setToPrice(value);
    }
  };

  const handleRadioChange = (selectedValue) => {
    setCarState(selectedValue);
  };

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

    if (fromYear) {
      carData.fromYear = fromYear;
    }

    if (toYear) {
      carData.toYear = toYear;
    }

    if (fromPrice) {
      carData.fromPrice = fromPrice;
    }

    if (toPrice) {
      carData.toPrice = toPrice;
    }

    carData.carState = carState;

    onFilter(carData);
  };

  const handleClearFilter = () => {
    // Reset all state values to their initial empty states
    setCarBrand("");
    setCarModel("");
    setRegion("");
    setGearbox("");
    setCarState("ALL");
    setFromYear("");
    setToYear("");
    setFromPrice("");
    setToPrice("");
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
            placeholder="Gearbox"
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <CarFilterField
            type="text"
            value={fromYear}
            onChange={handleFromYearChange}
            placeholder="From Year"
          />
        </div>
        <div className="col-md-6">
          <CarFilterField
            type="text"
            value={toYear}
            onChange={handleToYearChange}
            placeholder="To Year"
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <CarFilterField
            type="text"
            value={fromPrice}
            onChange={handleFromPriceChange}
            placeholder="From Price"
          />
        </div>
        <div className="col-md-6">
          <CarFilterField
            type="text"
            value={toPrice}
            onChange={handleToPriceChange}
            placeholder="To Price"
          />
        </div> 
      </div>
      <div className="row">
      <div className="col-md-6 mx-auto d-flex align-items-center">
  <div className="d-flex w-50">
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

  {/* Spacer */}
  <div className="flex-grow-1"></div>

  {/* Advanced Search and Clear Buttons - Right side */}
  <div className="d-flex">
    <button
      className="btn btn-primary ms-2"
      onClick={handleClearFilter}
    >
      Advanced Search
    </button>
    <button
      className="btn btn-secondary ms-2"
      onClick={handleClearFilter}
    >
      Clear
    </button>
  </div>
</div>

</div>


    </div>
  );
};

export default CarFilter;
