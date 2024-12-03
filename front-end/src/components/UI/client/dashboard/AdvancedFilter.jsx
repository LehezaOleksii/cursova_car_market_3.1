import React, { useState, useEffect } from "react";
import Select from "react-select";
import Header from "../../client/Header";
import Footer from "../../client/Footer";
import CarFilterField from "../../client/fields/CarFilterField";
import CarStateFilter from "../../client/fields/CarStateFilter"; 
import SaledCars from "./SaledCars";

const AdvancedFilter = () => {

  const [selectedRadio, setSelectedRadio] = useState("ALL");
  
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

  const handleRadioChange = (value) => {
    setSelectedRadio(value);
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

    setLoading(true); 

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
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="body">
      <Header />
      <div className="container mt-5 card w-50 mx-auto">
      <h4 className="text-center">Advanced Search</h4>
        <div className="row">
        <CarStateFilter onRadioChange={handleRadioChange} />
          <div className="col-md-6">
          <div className="h6">Brand</div>
            <Select
              value={selectedBrand}
              onChange={setSelectedBrand}
              options={brands}
              placeholder="Select Brand"
            />
          </div>
          <div className="col-md-6">
          <div className="h6">Model</div>
            <Select
              value={selectedModel}
              onChange={setSelectedModel}
              options={models}
              placeholder="Select Model"
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
            />
          </div>
          <div className="col-md-6">
          <div className="h6"> Gearbox</div>
            <Select
              value={selectedGearbox}
              onChange={setSelectedGearbox}
              options={gearboxes}
              placeholder="Select Gearbox"
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
          <div className="h6"> Region</div>
            <Select
              value={selectedRegion}
              onChange={setSelectedRegion}
              options={regions}
              placeholder="Select Region"
            />
          </div>
          <div className="col-md-6">
          <div className="h6"> Engine</div>
            <Select
              value={selectedEngine}
              onChange={setSelectedEngine}
              options={engines}
              placeholder="Select Engine"
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
          <div className="h6"> Min price</div>
            <CarFilterField
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min Price"
            />
          </div>
          <div className="col-md-6">
          <div className="h6"> Max price</div>
            <CarFilterField
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max Price"
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
          <div className="h6"> Min year</div>
            <CarFilterField
              type="number"
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
              placeholder="From Year"
            />
          </div>
          <div className="col-md-6">
          <div className="h6"> Max year</div>
            <CarFilterField
              type="number"
              value={maxYear}
              onChange={(e) => setMaxYear(e.target.value)}
              placeholder="To Year"
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
          <div className="h6"> Min mileage</div>
            <CarFilterField               
            type="number"
              value={minMileage}
              onChange={(e) => setMinMileage(e.target.value)}
              placeholder="Min Mileage"
            />
          </div>
          <div className="col-md-6">
          <div className="h6"> Max mileage</div>
            <CarFilterField
              type="number"
              value={maxMileage}
              onChange={(e) => setMaxMileage(e.target.value)}
              placeholder="Max Mileage"
            />
          </div>
        </div>
        <div className="row mt-4">
  <div className="col-md-6 offset-md-3 text-center">
    <button
      className="btn btn-primary btn-lg w-100 mb-3"
      onClick={handleSearch}
    >
      Search
    </button>
  </div>
</div>
</div>
{cars.length > 0 ? (
      <div className="dashboard mt-5">
        <SaledCars cars={cars} />
      </div>
) : (
  <div className="text-center mt-4">No cars found.</div>
)}

      <Footer />
    </div>
  );
};

export default AdvancedFilter;

