import React, { useState, useEffect } from "react";
import CarStateFilter from "../fields/CarStateFilter";
import Select from "react-select";
import CarFilterField from "../fields/CarFilterField";
import { Link } from "react-router-dom";

const CarFilter = ({ setCars }) => {

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
          fetch(`http://localhost:8080/cities`, {
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
            `http://localhost:8080/vehicles/brands/${selectedBrand.value}/models`,
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

  const setPostedCars = async () => {
    const url = `http://localhost:8080/vehicles`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        credentials: 'include',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtStr
      }
    });
    if (response.ok) {
      const data = await response.json();
      setCars(data);
    } else {
      console.error("Failed to fetch cars:", response.status);
    }
  };

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

    const queryParams = new URLSearchParams();

    if (selectedBrand) queryParams.append("brandName", selectedBrand.value);
    if (selectedModel) queryParams.append("modelName", selectedModel.value);
    if (selectedBodyType) queryParams.append("bodyType", selectedBodyType.value);
    if (selectedRegion) queryParams.append("region", selectedRegion.value);
    if (minPrice) queryParams.append("fromPrice", minPrice);
    if (maxPrice) queryParams.append("toPrice", maxPrice);
    if (minYear) queryParams.append("fromYear", minYear);
    if (maxYear) queryParams.append("toYear", maxYear);
    if (selectedRadio) queryParams.append("usageStatus", selectedRadio);

    try {
      setCars([]);
      queryParams.append("vehicleStatus", "POSTED");
      const url = `http://localhost:8080/vehicles/filter?${queryParams.toString()}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtStr,
        },
      });
      const data = await response.json();
      setCars(data.content || []);
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
  };

  return (
    <div className="card mt-3 mb-5 p-3">
      <h5 className="card-title mb-2">Car Filter</h5>
      <CarStateFilter selectedRadio={selectedRadio} onRadioChange={handleRadioChange} />
      <div className="row">
        <div className="col-md-6 mb-3">
          <Select
            value={selectedBrand}
            onChange={setSelectedBrand}
            options={brands}
            placeholder="Select Brand"
          />
        </div>
        <div className="col-md-6 mb-3">
          <Select
            value={selectedModel}
            onChange={setSelectedModel}
            options={models}
            placeholder="Select Model"
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
          />
        </div>
        <div className="col-md-6 mb-3">
          <Select
            value={selectedBodyType}
            onChange={setSelectedBodyType}
            options={bodyTypes}
            placeholder="Select Body Type"
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
      <div className="row">
        <div className="col-md-6 mx-auto d-flex justify-content-end align-items-center">
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
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
              </svg>
              Search
            </button>
          </div>
        </div>
        <div className="col-md-6 mx-auto d-flex align-items-center">
          <Link
            to={`/client/advanced_filter`}
            className="btn btn-primary"
            style={{ whiteSpace: 'nowrap' }}
          >
            Advanced Search
          </Link>
          <button
            className="btn btn-secondary ms-3"
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
