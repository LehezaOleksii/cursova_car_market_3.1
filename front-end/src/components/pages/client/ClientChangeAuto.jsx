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
      const nextIndex = (prevIndex + 1) % photos.length;
      scrollThumbnails(nextIndex, "right");
      return nextIndex;
    });
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prevIndex) => {
      const prevIndexAdjusted = (prevIndex - 1 + photos.length) % photos.length;
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
    if (!mileage || mileage > 9000000) {
      alert("Please enter a valid mileage. Mileage should be less than 9 000 000.");
      return;
    }
    if (! priceString ||  priceString > 2000000) {
      alert("Please enter a valid price. Price should be less than 2 000 000.");
      return;
    }
    const base64Photos = await Promise.all(photos.map(convertImagesToBase64));

    const car = {
      id: carId,
      userId: userId,
      photos: base64Photos,
      brandName,
      modelName,
      region,
      year: yearNum,
      mileage,
      price: priceString,
      gearbox,
      phoneNumber,
      bodyType,
      engine,
      usageStatus: selectedRadio,
      description,
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
        console.error("Error updating car:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const convertImagesToBase64 = async (image) => {
    return new Promise((resolve, reject) => {
      if (typeof image === "string" && (image.startsWith("/9j/") || image.startsWith("iVBORw0K"))) {
        resolve(image);
      } else if (image instanceof Blob || image instanceof File) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        };
        reader.onerror = () => {
          console.error("Error reading image:", image);
          reject(null);
        };
        reader.readAsDataURL(image);
      } else {
        console.error("Invalid image format:", image);
        reject(null);
      }
    });
  };

  const promises = photos.map((image) => convertImagesToBase64(image));

  Promise.all(promises)
    .then((byteArrays) => {
      fetch(`http://localhost:8080/vehicles/${carId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photos: byteArrays.map((arr) => Array.from(arr)) }),
      })
        .then((response) => response.json())
        .then((data) => console.log("Success:", data))
        .catch((error) => console.error("Error sending photos:", error));
    })
    .catch((error) => console.error("Error converting images:", error));


  useEffect(() => {
    const fetchCarData = async () => {
      if (carId) {
        try {
          const url = `http://localhost:8080/vehicles/${carId}/update_info`;
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
            setMileage(data.mileage || "0");
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

  const handlePhotoChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + photos.length <= 20) {
      setPhotos((prevPhotos) => [...prevPhotos, ...selectedFiles]);
    } else {
      alert("You can only upload up to 20 photos.");
    }
  };

  const handleDeletePhoto = (indexToRemove) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="body">
      <WrappedHeader />
      <div className="container mt-5 mb-4">
        <div className="row">
          <div className="col-md-7">
            <label htmlFor="carPhotos" className="photo-wrapper br16">
              {photos.length > 0 ? (
                <div
                  className="photo-container"
                  style={{
                    transform: `translateX(-${currentPhotoIndex * 100}%)`,
                  }}
                >
                  {photos.length > 0 ? (
                    photos.map((photo, index) => {
                      const photoSrc =
                        typeof photo === "string"
                          ? `data:image/jpeg;base64,${photo}`
                          : URL.createObjectURL(photo);

                      return (
                        <img key={index} src={photoSrc} alt="Car" className="photo-image img" />
                      );
                    })
                  ) : (
                    <div className="add-photo-placeholder">Add Photo</div>
                  )}

                </div>
              ) : (
                <div className="photo-container"
                  style={{
                    height: "100%",
                    backgroundColor: "#ccc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#666",
                    fontSize: "18px",
                    fontWeight: "bold",
                    borderRadius: "10px",
                  }}
                >
                  Click to add photos
                </div>
              )}
              {photos.length > 0 && (
                <>
                  <button className="photo-nav-button left" onClick={prevPhoto}>
                    &#10094;
                  </button>
                  <button className="photo-nav-button right" onClick={nextPhoto}>
                    &#10095;
                  </button>
                </>
              )}
            </label>
            <input
              type="file"
              id="carPhotos"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
            <div
              className="thumbnail-container"
              ref={thumbnailContainerRef}
              style={{
                display: "flex",
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
            >
              <style>
                {`
      .thumbnail-container::-webkit-scrollbar {
        display: none; /* Hides scrollbar in Chrome, Safari, and Edge */
      }
    `}
              </style>

              <div
                className="small-image-container add-photo-btn"
                onClick={() => document.getElementById("carPhotos").click()}
                style={{
                  position: "relative",
                  minWidth: "100px",
                  height: "100px",
                  margin: "5px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  backgroundColor: "#ddd",
                  cursor: "pointer",
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#666",
                }}
              >
                +
              </div>

              {photos.map((photo, index) => {
                const photoSrc =
                  typeof photo === "string"
                    ? `data:image/jpeg;base64,${photo}`
                    : URL.createObjectURL(photo);

                return (
                  <div
                    key={index}
                    className={`small-image-container ${currentPhotoIndex === index ? "active" : ""}`}
                    onClick={() => handleThumbnailScroll(index)}
                    style={{
                      position: "relative",
                      minWidth: "100px",
                      height: "100px",
                      margin: "5px",
                      borderRadius: "8px",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      backgroundColor: "#f8f8f8",
                    }}
                  >
                    <img
                      src={photoSrc}
                      alt={`Thumbnail ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      className="delete-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(index);
                      }}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        background: "rgba(255, 0, 0, 0.5)",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "30px",
                        height: "30px",
                        cursor: "pointer",
                        textAlign: "center",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>
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
