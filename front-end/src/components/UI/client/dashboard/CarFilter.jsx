import React, { useState, useEffect } from "react";
import CarStateFilter from "../fields/CarStateFilter";
import Select from "react-select";
import CarFilterField from "../fields/CarFilterField";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import "./dashboard.css";

const CarFilter = ({ setCars, setTotalPages, setCurrentPage, setFilterState }) => {
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
  const [searchParams, setSearchParams] = useSearchParams();

  const handleRadioChange = (value) => {
    setSelectedRadio(value);
  };

  const page = parseInt(searchParams.get("page")) || 0;
  const size = parseInt(searchParams.get("size")) || 10;

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

  const setPostedCars = async () => {
    const url = `/vehicles`;
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
      setTotalPages(data.totalPages || 0);
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

    const filters = {
      brandName: selectedBrand?.value || "",
      modelName: selectedModel?.value || "",
      bodyType: selectedBodyType?.value || "",
      region: selectedRegion?.value || "",
      fromPrice: minPrice,
      toPrice: maxPrice,
      fromYear: minYear,
      toYear: maxYear,
      usageStatus: selectedRadio,
    };

    setFilterState(filters);

    const queryParams = new URLSearchParams(filters);

    if (selectedBrand) queryParams.append("brandName", selectedBrand.value);
    if (selectedModel) queryParams.append("modelName", selectedModel.value);
    if (selectedBodyType) queryParams.append("bodyType", selectedBodyType.value);
    if (selectedRegion) queryParams.append("region", selectedRegion.value);
    if (minPrice) queryParams.append("fromPrice", minPrice);
    if (maxPrice) queryParams.append("toPrice", maxPrice);
    if (minYear) queryParams.append("fromYear", minYear);
    if (maxYear) queryParams.append("toYear", maxYear);
    if (selectedRadio) queryParams.append("usageStatus", selectedRadio);

    queryParams.append("page", page);
    queryParams.append("size", size);

    try {
      setCars([]);
      queryParams.append("vehicleStatus", "POSTED");
      const url = `/vehicles/filter?${queryParams.toString()}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtStr,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching cars: ${response.status}`);
      }

      const data = await response.json();
      setCars(data.content || []);
      setTotalPages(data.totalPages);
      setCurrentPage(0);
      setSearchParams({ page: 0, size });
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
    setMinYear("From Year");
    setMaxYear("To Year");
    setMinPrice("");
    setMaxPrice("");
    setFilterState({});
    setSearchParams({ page: 0, size });
    setTotalPages(0);
    setCurrentPage(0);
    setPostedCars()
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  };

  const years = generateYears();

  const getSelectedStyle = (value, placeholder) => {
    return value === placeholder ? { color: "grey" } : {};
  };

  useEffect(() => {
    setMinYear("From Year");
    setMaxYear("To Year");
  }, []);

  return (
    <div className="card mt-4 mb-4 p-3 br16 box-shadow-12">
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
      </div>
      <div className="row ">
        <div className="col-md-6 mb-3">
          <Select
            value={selectedModel}
            onChange={setSelectedModel}
            options={models}
            placeholder="Select Model"
            noOptionsMessage={() => "Select brand before model"}
            menuPortalTarget={document.body}
            menuShouldScrollIntoView={false}
            styles={{
              control: (base) => ({
                ...base,
                borderRadius: "12px",
                boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.06)',
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
              option: (base) => ({
                ...base,
                ":hover": {
                  backgroundColor: "#f1f1f1",
                },
              }),
            }}
          />
        </div>
        <div className="col-md-6 d-flex gap-3">
          <div className="w-50">
            <select
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
              className="form-select box-shadow-06"
              style={{
                ...getSelectedStyle(minYear, "From Year"),
                borderRadius: '12px',
                transition: 'box-shadow 0.3s ease',
                padding: '6px 10px',
                width: '100%',
              }}
            >
              <option value="From Year">From Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="w-50">
            <select
              value={maxYear}
              onChange={(e) => setMaxYear(e.target.value)}
              className="form-select box-shadow-06"
              style={{
                ...getSelectedStyle(maxYear, "To Year"),
                borderRadius: '12px',
                transition: 'box-shadow 0.3s ease',
                padding: '6px 10px',
                width: '100%',
              }}
            >
              <option value="To Year">To Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="row">
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
                transition: '0.3s ease',
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
        <div className="col-md-6 d-flex gap-3">
          <div className="w-50">
            <CarFilterField
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="From Price"
            />
          </div>
          <div className="w-50">
            <CarFilterField
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="To Price"
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 d-flex align-items-center gap-4">
          <button className="btn btn-blue-color btn-primary w-50 br16 box-shadow-12" onClick={handleSearch}>
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
          <button
            onClick={() => navigate('/advanced_filter')}
            className="btn btn-primary btn-blue-color w-50 br16 box-shadow-12"
          >
            Advanced Search
          </button>
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-start">
          <button className="btn btn-secondary br16 box-shadow-12" onClick={handleClearFilter}>
            Clear filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarFilter;
