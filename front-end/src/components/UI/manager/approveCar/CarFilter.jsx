import React, { useState, useEffect } from "react";
import CarStateFilter from "./CarStateFilter";
import Select from "react-select";
import CarFilterField from "../../client/fields/CarFilterField";
import { useNavigate } from "react-router-dom";

const CarFilter = ({ setCars, page, size }) => {
  const navigate = useNavigate();

  const [selectedRadio, setSelectedRadio] = useState("ALL");

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);
  const [regions, setRegions] = useState([]);

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedBodyType, setSelectedBodyType] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");

  const jwtStr = localStorage.getItem("jwtToken");

  const handleRadioChange = (value) => {
    setSelectedRadio(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsResponse, bodyTypes, regionsResponse] = await Promise.all([
          fetch(`/vehicles/brands`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwtStr,
            },
          }),
          fetch(`/vehicles/body-types`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwtStr,
            },
          }),
          fetch(`/cities`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + jwtStr,
            },
          }),
        ]);

        setBrands((await brandsResponse.json()).map((brand) => ({ value: brand, label: brand })));
        setBodyTypes((await bodyTypes.json()).map((bodyTypes) => ({ value: bodyTypes, label: bodyTypes })));
        setRegions((await regionsResponse.json()).map((region) => ({ value: region, label: region })));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [jwtStr]);

  useEffect(() => {
    if (selectedBrand) {
      const fetchModels = async () => {
        try {
          const response = await fetch(
            `/vehicles/brands/${selectedBrand.value}/models`,
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
          setSelectedModel(null);
        } catch (error) {
          console.error("Error fetching models:", error);
        }
      };

      fetchModels();
    } else {
      setModels([]);
      setSelectedModel(null);
    }
  }, [selectedBrand, jwtStr]);

  const handleSearch = async () => {
    if (parseFloat(minPrice) < 0 || parseFloat(maxPrice) < 0) {
      alert("Price values must be positive.");
      return;
    }

    if (parseFloat(minPrice) > parseFloat(maxPrice)) {
      alert("Min price cannot be greater than max price.");
      return;
    }

    if (parseFloat(minYear) < 0 || parseFloat(maxYear) < 0) {
      alert("Year values must be positive.");
      return;
    }

    if (parseFloat(minYear) > parseFloat(maxYear)) {
      alert("Min year cannot be greater than max year.");
      return;
    }

    let routeUrl = `/cars/managment`;

    const queryParams = new URLSearchParams();

    if (selectedBrand) queryParams.append("brandName", selectedBrand.value);
    if (selectedModel) queryParams.append("modelName", selectedModel.value);
    if (selectedBodyType) queryParams.append("bodyType", selectedBodyType.value);
    if (selectedRegion) queryParams.append("region", selectedRegion.value);
    if (minPrice) queryParams.append("minPrice", minPrice);
    if (maxPrice) queryParams.append("maxPrice", maxPrice);
    if (minYear) queryParams.append("minYear", minYear);
    if (maxYear) queryParams.append("maxYear", maxYear);
    queryParams.append("status", selectedRadio);
    queryParams.append("page", 0);
    queryParams.append("size", size);

    navigate(`${routeUrl}?${queryParams.toString()}`);
  };


  const setPostedCars = async () => {
    let routeUrl = `/vehicles/management/filter`;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("size", size);
    const fullUrl = `${routeUrl}?${queryParams.toString()}`;

    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          credentials: 'include',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwtStr
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCars(data.content);
      } else {
        console.error("Failed to fetch cars:", response.status);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const handleClearFilter = () => {
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedRegion("");
    setSelectedBodyType("");
    handleRadioChange("ALL");
    setMinYear("");
    setMaxYear("");
    setMinPrice("");
    setMaxPrice("");
    setPostedCars()
    const routeUrl = `/cars/managment`;
    navigate(`${routeUrl}`);
  };

  return (
    <div className="card mb-3 br24 box-shadow-12 col-8 mx-auto">
      <div className="card-header">
        <h5 className="card-title text-center">Car Filter</h5>
      </div>
      <div className="p-3">
        <CarStateFilter selectedRadio={selectedRadio} onRadioChange={handleRadioChange} />
        <div className="row">
          <div className="col-md-6 mb-3">
            <Select
              value={selectedBrand}
              onChange={setSelectedBrand}
              options={brands}
              placeholder="Select Brand"
              menuPortalTarget={document.body}
              menuShouldScrollIntoView={false}
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '12px',
                  boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.06)',
                  transition: 'box-shadow 0.3s ease',
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  padding: '0 18px',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '12px',
                }),
                option: (base) => ({
                  ...base,
                  ':hover': {
                    backgroundColor: '#f1f1f1',
                  },
                }),
              }}
            />
          </div>
          <div className="col-md-6 mb-3">
            <Select
              value={selectedModel}
              onChange={setSelectedModel}
              placeholder="Select Model"
              menuPortalTarget={document.body}
              menuShouldScrollIntoView={false}
              options={
                models.length > 0
                  ? models
                  : [{ label: "Select Brand Before Selecting Model", value: "", isDisabled: true }]
              }
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: "12px",
                  boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.06)",
                  transition: "box-shadow 0.3s ease",
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  padding: "0 18px",
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: "12px",
                }),
                option: (base, { isDisabled }) => ({
                  ...base,
                  color: isDisabled ? "" : base.color,
                  backgroundColor: isDisabled ? "transparent" : base.backgroundColor,
                  ":hover": {
                    backgroundColor: !isDisabled ? "#f1f1f1" : "transparent",
                  },
                }),
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <Select
              value={selectedRegion}
              onChange={setSelectedRegion}
              options={regions}
              placeholder="Select Region"
              menuPortalTarget={document.body}
              menuShouldScrollIntoView={false}
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '12px',
                  boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.06)',
                  transition: 'box-shadow 0.3s ease',
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  padding: '0 18px',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '12px',
                }),
                option: (base) => ({
                  ...base,
                  ':hover': {
                    backgroundColor: '#f1f1f1',
                  },
                }),
              }}
            />
          </div>
          <div className="col-md-6 mb-3">
            <Select
              value={selectedBodyType}
              onChange={setSelectedBodyType}
              options={bodyTypes}
              placeholder="Select Body Type"
              menuPortalTarget={document.body}
              menuShouldScrollIntoView={false}
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '12px',
                  boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.06)',
                  transition: 'box-shadow 0.3s ease',
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  padding: '0 18px',
                }),
                menu: (base) => ({
                  ...base,
                  borderRadius: '12px',
                }),
                option: (base) => ({
                  ...base,
                  ':hover': {
                    backgroundColor: '#f1f1f1',
                  },
                }),
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <CarFilterField
              type="number"
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
              placeholder="From Year"
            />
          </div>
          <div className="col-md-6">
            <CarFilterField
              type="number"
              value={maxYear}
              onChange={(e) => setMaxYear(e.target.value)}
              placeholder="To Year"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <CarFilterField
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="From Price"
            />
          </div>
          <div className="col-md-6">
            <CarFilterField
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max Price"
            />
          </div>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-6 mx-auto d-flex justify-content-end align-items-center">
          <div className="d-flex w-50">
            <button
              className="btn btn-primary w-100 br16 box-shadow-12"
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
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
              Search
            </button>
          </div>
        </div>
        <div className="col-md-6 mx-auto d-flex align-items-center">
          <button
            className="btn btn-secondary ms-3 w-25 box-shadow-12 br16"
            onClick={handleClearFilter}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};
export default CarFilter;
