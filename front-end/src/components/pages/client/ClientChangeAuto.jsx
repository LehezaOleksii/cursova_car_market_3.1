import CarFilterField from "../../UI/client/fields/CarFilterField";
import React, { useState, useEffect, useRef } from "react";
import WrappedHeader from "../../WrappedHeader";
import WrappedFooter from "../../WrappedFooter";
import CarState from "../../UI/client/fields/CarState";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import "../../UI/client/dashboard/dashboard.css";
import "../client/dashboard_car_styles.css";

const ClientChangeAuto = () => {

  const [selectedRadio, setSelectedRadio] = useState("NEW");
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const thumbnailContainerRef = useRef(null);
  const userId = localStorage.getItem("id");
  const { carId } = useParams();
  const jwtStr = localStorage.getItem("jwtToken");

  const navigate = useNavigate();

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
  const [car, setCar] = useState();

  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);
  const [engines, setEngines] = useState([]);
  const [gearboxes, setGearboxes] = useState([]);
  const [regions, setRegions] = useState([]);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % car.photos.length;
      scrollThumbnails(nextIndex, "right");
      return nextIndex;
    });
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => {
      const prevIndexAdjusted = (prevIndex - 1 + car.photos.length) % car.photos.length;
      scrollThumbnails(prevIndexAdjusted, "left");
      return prevIndexAdjusted;
    });
  };

  const handleThumbnailScroll = (index) => {
    setCurrentPhotoIndex(index);
    scrollThumbnails(index);
  };

  const scrollThumbnails = (index) => {
    if (thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current;
      const thumbnail = container.children[index];

      if (thumbnail) {
        const containerWidth = container.clientWidth;
        const thumbnailRect = thumbnail.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const isCentered =
          thumbnailRect.left >= containerRect.left + containerWidth / 3 &&
          thumbnailRect.right <= containerRect.right - containerWidth / 3;

        if (!isCentered) {
          container.scrollTo({
            left: thumbnail.offsetLeft - containerWidth / 2 + thumbnail.clientWidth / 2,
            behavior: "smooth",
          });
        }
      }
    }
  };
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
    if (modelName) {
      const fetchEngines = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/vehicles/brands/models/${modelName}/engines`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + jwtStr,
              },
            }
          );
          const enginesData = await response.json();
          setEngines([]);
          setEngines(enginesData.map((engine) => ({ value: engine, label: engine })));
        } catch (error) {
          console.error("Error fetching engines:", error);
        }
      };
      fetchEngines();
    } else {
      setEngines([]);
    }
  }, [modelName, jwtStr]);

  useEffect(() => {
    if (brandName) {
      const fetchModels = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/vehicles/brands/${brandName}/models`,
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
          setEngines([]);
        } catch (error) {
          console.error("Error fetching models:", error);
        }
      };
      fetchModels();
    } else {
      setModels([]);
      setEngines([]);
    }
  }, [brandName, jwtStr]);

  const handleSubmit = async () => {
    const yearNum = parseInt(year, 10);
    console.log(brandName + " " + modelName + " " + gearbox + " " + bodyType + " " + region + " " + engine + " " + photos);
    if (!brandName || !modelName || !bodyType || !gearbox || !region || !engine || photos.length == 0) {
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

    var priceString;

    if (price && typeof price === "string") {
       priceString = price.replace(/\D+/g, '');
    } else {
        priceString = price;
    } 

    const phoneNumberTest = phoneNumber.replace(/\s+/g, '');

    if (!phoneNumberTest || !/^(\+38)?(0\d{9})$/.test(phoneNumberTest)) {
      alert("Please enter a valid Ukrainian phone number.");
      return;
    }
    const base64Photos = await convertImagesToBase64(photos);
    setPhotos(base64Photos);
    const car = {
      id: carId,
      userId: userId,
      photos: base64Photos,
      brandName: brandName,
      modelName: modelName,
      region: region,
      year: yearNum,
      mileage: mileage,
      price: priceString,
      gearbox: gearbox?.value,
      phoneNumber: phoneNumber,
      bodyType: bodyType,
      engine: engine,
      usageStatus: selectedRadio,
      description: description
    };

    try {
      const response = await fetch(`http://localhost:8080/vehicles/${carId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwtStr,
        },
        body: JSON.stringify(car),
      });

      if (response.ok) {
        navigate(`/dashboard`);
      } else {
        console.error("Error adding car:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const convertImagesToBase64 = (images) => {
    const promises = images.map((image) => {
      if (!(image instanceof Blob)) {
        console.error("Invalid image format:", image);
        return Promise.resolve(null);
      }
  
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });
    });
  
    return Promise.all(promises);
  };
  

  useEffect(() => {
    const fetchCarData = async () => {
      if (carId) {
        try {
          const url = `http://localhost:8080/vehicles/${carId}/info`;
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + jwtStr
            },
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            setPhotos(data.photos);
            setCarBrand(data.brandName || null);
            setCarModel(data.modelName || null);
            setRegion(data.region || "");
            setYear(data.year || "");
            setMileage(data.mileage || "");
            setPrice(data.price || "");
            setGearbox(data.gearbox || null);
            setPhoneNumber(data.phoneNumber || "");
            setBodyType(data.bodyType || "");
            setEngine(data.engine || "");
            setDescription(data.description || "");
            setSelectedRadio(data.usageStatus);
            setCar(data);
          } else {
            console.error("Error fetching car data:", response.statusText);
          }
        } catch (error) {
          console.error("Error fetching car data:", error);
        }
      }
    };
    fetchCarData();
  }, [carId, jwtStr]);

  return (
    <div className="body">
      <WrappedHeader />
      <div className="container mt-5 mb-4">
        <div className="row">
          <div className="col-md-7">
            <div className="photo-wrapper br16">
              <div
                className="photo-container"
                style={{
                  transform: `translateX(-${currentPhotoIndex * 100}%)`,
                }}
              >
                {car?.photos?.map((photo, index) => (
                  <img
                    key={index}
                    src={`data:image/jpeg;base64,${photo}`}
                    alt="Car"
                    className="photo-image img"
                  />
                ))}
              </div>
              <button className="photo-nav-button left" onClick={prevPhoto}>
                &#10094;
              </button>
              <button className="photo-nav-button right" onClick={nextPhoto}>
                &#10095;
              </button>
            </div>
            {car && car.photos && car.photos.length > 1 && (
              <div>
                <div
                  className="thumbnail-container"
                  ref={thumbnailContainerRef}
                >
                  {car.photos.map((photo, index) => (
                    <div
                      key={index}
                      className={`small-image-container ${currentPhotoIndex === index ? "active" : ""}`}
                      onClick={() => handleThumbnailScroll(index)}
                    >
                      <img src={`data:image/jpeg;base64,${photo}`} alt={`Thumbnail ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="col-md-5">
            <div className="card  br24 box-shadow-12">
              <div className="card-body">
                <h5 className="card-title">Add Auto</h5>
                <CarState
                  selectedRadio={selectedRadio}
                  onRadioChange={setSelectedRadio}
                />
                <div className="row mb-3">
                  <div className="col-md-6">
                    <Select
                      value={brands.find(brand => brand.value === brandName)}
                      onChange={(selectedOption) => setCarBrand(selectedOption.value)}
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
                    <Select
                      value={bodyTypes.find(bodyTypeName => bodyTypeName.value === bodyType)}
                      onChange={(selectedOption) => setBodyType(selectedOption)}
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
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div>
                      <Select
                        key={models}
                        value={models.find(model => model.value === modelName)}
                        onChange={(selectedOption) => setCarModel(selectedOption.value)}
                        options={
                          models.length > 0
                            ? models
                            : [{ label: "Select Brand Before Selecting Model", value: "", isDisabled: true }]
                        }
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
                  <div className="col-md-6">
                    <Select
                      key={engines}
                      value={engines.find(engineName => engineName.value === car.engine)}
                      onChange={(selectedOption) => setEngine(selectedOption.value)}
                      options={
                        engines.length > 0
                          ? engines
                          : [{ label: "Select Model Before Selecting Engine", value: "", isDisabled: true }]
                      }
                      placeholder="Select Engine"
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
                  <div className="col-md-6">
                    <Select
                      value={gearboxes.find(gearboxName => gearboxName.value === gearbox)}
                      onChange={(selectedOption) => setGearbox(selectedOption)}
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
                      value={regions.find(regionName => regionName.value === region)}
                      onChange={(selectedOption) => setRegion(selectedOption)}
                      options={region}
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
                  <div className="card-body">
                    <h5 className="card-title">Description</h5>
                    <textarea
                      className="form-control br16"
                      rows="4"
                      value={description}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value.length <= 1000) {
                          setDescription(value);
                        }
                      }}
                      placeholder="Enter car description..."
                    />
                    <small className="text-muted">
                      {description.length}/1000 (max characters )
                    </small>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary br24 box-shadow-12"
                  onClick={handleSubmit}
                >
                  Save Auto
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WrappedFooter />
    </div>
  );
};

export default ClientChangeAuto;
