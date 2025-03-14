import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import WrappedHeader from "../../../WrappedHeader";
import WrappedFooter from "../../../WrappedFooter";
import CarFilterField from "../../client/fields/CarFilterField";
import CarStateFilter from "../../client/fields/CarStateFilter";
import SaledCars from "./SaledCars";

const AdvancedFilter = () => {

  const [selectedRadio, setSelectedRadio] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);
  const [engines, setEngines] = useState([]);
  const [gearboxes, setGearboxes] = useState([]);
  const [regions, setRegions] = useState([]);

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedBodyType, setSelectedBodyType] = useState(null);
  const [selectedEngine, setSelectedEngine] = useState(null);
  const [selectedGearbox, setSelectedGearbox] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [minMileage, setMinMileage] = useState("");
  const [maxMileage, setMaxMileage] = useState("");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  const jwtStr = localStorage.getItem("jwtToken");

  const isPreviousDisabled = currentPage <= 0;
  const isNextDisabled = currentPage >= totalPages - 1;

  const location = useLocation();
  const navigate = useNavigate();

  const handleRadioChange = (value) => {
    setSelectedRadio(value);
  };

  const getPageAndSizeFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page")) || 0;
    const size = parseInt(params.get("size")) || 5;
    return { page, size };
  };

  const handlePageChange = (page) => {
    const { size } = getPageAndSizeFromUrl();
    if (page < 0 || page >= totalPages) return;

    setCurrentPage(page);
    navigate(`?page=${page}&size=${size}`);
    fetchData(page, size);
  };

  const fetchData = async (page = 0, size = 5) => {
    const queryParams = new URLSearchParams();

    if (selectedBrand) queryParams.append("brandName", selectedBrand.value);
    if (selectedModel) queryParams.append("modelName", selectedModel.value);
    if (selectedBodyType) queryParams.append("bodyType", selectedBodyType.value);
    if (selectedEngine) queryParams.append("engine", selectedEngine.value);
    if (selectedGearbox) queryParams.append("gearBox", selectedGearbox.value);
    if (selectedRegion) queryParams.append("region", selectedRegion.value);
    if (minPrice) queryParams.append("fromPrice", minPrice);
    if (maxPrice) queryParams.append("toPrice", maxPrice);
    if (minYear) queryParams.append("fromYear", minYear);
    if (maxYear) queryParams.append("toYear", maxYear);
    if (minMileage) queryParams.append("fromMileage", minMileage);
    if (maxMileage) queryParams.append("toMileage", maxMileage);
    if (selectedRadio) queryParams.append("usageStatus", selectedRadio);

    queryParams.append("vehicleStatus", "POSTED");
    queryParams.append("page", page);
    queryParams.append("size", size);

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/vehicles/filter?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtStr,
        },
      });
      const data = await response.json();
      setCars(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
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

        setBrands((await brandsResponse.json()).map((brand) => ({ value: brand, label: brand })));
        setBodyTypes((await bodyTypesResponse.json()).map((type) => ({ value: type, label: type })));
        setGearboxes((await gearboxesResponse.json()).map((gearbox) => ({ value: gearbox, label: gearbox })));
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
          setSelectedEngine(null);
        } catch (error) {
          console.error("Error fetching models:", error);
        }
      };

      fetchModels();
    } else {
      setModels([]);
      setSelectedModel(null);
      setSelectedEngine(null);
    }
  }, [selectedBrand, jwtStr]);

  useEffect(() => {
    if (selectedModel) {
      const fetchEngines = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/vehicles/brands/models/${selectedModel.value}/engines`,
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
          setSelectedEngine(null);
        } catch (error) {
          console.error("Error fetching engines:", error);
        }
      };

      fetchEngines();
    } else {
      setEngines([]);
      setSelectedEngine(null);
    }
  }, [selectedModel, jwtStr]);

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

    if (parseFloat(minMileage) < 0 || parseFloat(maxMileage) < 0) {
      alert("Mileage values must be positive.");
      return;
    }

    if (parseFloat(minMileage) > parseFloat(maxMileage)) {
      alert("Min mileage cannot be greater than max mileage.");
      return;
    }

    const queryParams = new URLSearchParams();

    if (selectedBrand) queryParams.append("brandName", selectedBrand.value);
    if (selectedModel) queryParams.append("modelName", selectedModel.value);
    if (selectedBodyType) queryParams.append("bodyType", selectedBodyType.value);
    if (selectedEngine) queryParams.append("engine", selectedEngine.value);
    if (selectedGearbox) queryParams.append("gearBox", selectedGearbox.value);
    if (selectedRegion) queryParams.append("region", selectedRegion.value);
    if (minPrice) queryParams.append("fromPrice", minPrice);
    if (maxPrice) queryParams.append("toPrice", maxPrice);
    if (minYear) queryParams.append("fromYear", minYear);
    if (maxYear) queryParams.append("toYear", maxYear);
    if (minMileage) queryParams.append("fromMileage", minMileage);
    if (maxMileage) queryParams.append("toMileage", maxMileage);
    if (selectedRadio) queryParams.append("usageStatus", selectedRadio);

    queryParams.append("vehicleStatus", "POSTED");
    queryParams.append("page", 0);
    queryParams.append("size", pageSize);

    setLoading(true);
    setCurrentPage(0);
    handlePageChange(0);

    try {
      setCars([]);
      const response = await fetch(`http://localhost:8080/vehicles/filter?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtStr,
        },
      });
      const data = await response.json();
      setCars(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
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
    setMinMileage("");
    setMaxMileage("");
    setPostedCars();
  };

  const setPostedCars = async () => {
    const url = `http://localhost:8080/vehicles/posted`;
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

  const getSelectedStyle = (value, placeholder) => {
    return value === placeholder ? { color: "grey" } : {};
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

  return (
    <div className="body mb-4">
      <WrappedHeader />
      <div className="container mt-5 card w-50 mx-auto br24 box-shadow-12">
        <h4 className="text-center mt-4">Advanced Filter</h4>
        <div className="row">
          <CarStateFilter selectedRadio={selectedRadio} onRadioChange={handleRadioChange} />
          <div className="col-md-6">
            <div className="h6">Brand</div>
            <Select
              value={selectedBrand}
              onChange={setSelectedBrand}
              options={brands}
              placeholder="Select Brand"
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
          <div className="col-md-6">
            <div className="h6">Model</div>
            <Select
              value={selectedModel}
              onChange={setSelectedModel}
              options={models}
              placeholder="Select Model"
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
        <div className="row mt-3">
          <div className="col-md-6">
            <div className="h6">Body Type</div>
            <Select
              value={selectedBodyType}
              onChange={setSelectedBodyType}
              options={bodyTypes}
              placeholder="Select Body Type"
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
          <div className="col-md-6">
            <div className="h6">Engine</div>
            <Select
              value={selectedEngine}
              onChange={setSelectedEngine}
              options={engines}
              placeholder="Select Engine"
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
        <div className="row mt-3">
          <div className="col-md-6">
            <div className="h6">Gearbox</div>
            <Select
              value={selectedGearbox}
              onChange={setSelectedGearbox}
              options={gearboxes}
              placeholder="Select Gearbox"
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
          <div className="col-md-6">
            <div className="h6">Region</div>
            <Select
              value={selectedRegion}
              onChange={setSelectedRegion}
              options={regions}
              placeholder="Select Region"
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
        <div className="row mt-3">
          <div className="col-md-6">
            <div className="h6"> Min Price</div>
            <CarFilterField
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min Price"
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
          <div className="col-md-6">
            <div className="h6"> Max Price</div>
            <CarFilterField
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max Price"
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
          <div className="col-md-6 mb-3">
            <div className="h6"> Min Year</div>
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
          <div className="col-md-6 mb-3">
            <div className="h6"> Max Year</div>
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
        <div className="row">
          <div className="col-md-6">
            <div className="h6"> Min Mileage</div>
            <CarFilterField
              type="number"
              value={minMileage}
              onChange={(e) => setMinMileage(e.target.value)}
              placeholder="Min Mileage"
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
          <div className="col-md-6">
            <div className="h6"> Max Mileage</div>
            <CarFilterField
              type="number"
              value={maxMileage}
              onChange={(e) => setMaxMileage(e.target.value)}
              placeholder="Max Mileage"
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
        <div className="row mt-1 mb-3">
          <div className="row mt-3">
            <div className="col-md-3 d-flex justify-content-center">
            </div>
            <div className="col-md-6 d-flex justify-content-center">
              <button className="btn btn-primary btn-md w-100 br24 box-shadow-12" onClick={handleSearch}>
                Search
              </button>
            </div>
            <div className="col-md-3 d-flex justify-content-end">
              <button className="btn btn-secondary btn-md w-75 br24 box-shadow-12" onClick={handleClearFilter}>
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
      {cars.length > 0 ? (
        <>
          <div className="dashboard mt-5">
            <SaledCars cars={cars} />
          </div>
          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-outline-primary mx-1"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={isPreviousDisabled}
            >
              &lt; Previous
            </button>

            {[...Array(totalPages).keys()].map((page) => (
              <button
                key={page}
                className={`btn ${page === currentPage ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
                onClick={() => handlePageChange(page)}
              >
                {page + 1}
              </button>
            ))}

            <button
              className="btn btn-outline-primary mx-1"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={isNextDisabled}
            >
              Next &gt;
            </button>
          </div>
        </>
      ) : (
        <div className="text-center mt-4">No cars found.</div>
      )}
      <WrappedFooter />
    </div>
  );
};

export default AdvancedFilter;

