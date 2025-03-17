import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import WrappedHeader from "../../WrappedHeader";
import WrappedFooter from "../../WrappedFooter";
import gearboxIcon from '../../../resources/gearbox.png';
import canisterIcon from '../../../resources/canister.png';
import "../../UI/client/dashboard/dashboard.css"
import "./dashboard_car_styles.css"

const SaleCar = () => {
  const { carId } = useParams();
  const jwtStr = localStorage.getItem("jwtToken");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [priceInUah, setPriceInUah] = useState(null);
  const [car, setCar] = useState();
  const [user, setUser] = useState();
  const [liked, setLiked] = useState()
  const [loading, setLoading] = useState(true);
  const thumbnailContainerRef = useRef(null);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/chats?userId=${user.id}`);
  };

  const handleThumbnailScroll = (index) => {
    setCurrentPhotoIndex(index);
    scrollThumbnails(index);
  };

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

  useEffect(() => {
    if (car?.price) {
      fetchExchangeRate();
    }
  }, [car]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchUserData();
        await fetchCar();
      } catch (error) {
        console.error("Error fetching data:", error);
        setCar(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jwtStr, carId]);

  const fetchCar = async () => {
    try {
      const response = await fetch(`http://auto-market-backend:8080/vehicles/${carId}/info`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + jwtStr,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const carData = await response.json();
      if (!carData || Object.keys(carData).length === 0) {
        throw new Error("Car data is empty or undefined");
      }
      setCar(carData);
      setLiked(carData.userLiked);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      setCar(null);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://auto-market-backend:8080/users/info/vehicleId/${carId}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + jwtStr,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const userData = await response.json();
      if (!userData || Object.keys(userData).length === 0) {
        throw new Error("User data is empty or undefined");
      }
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    }
  };

  const fetchExchangeRate = async () => {
    try {
      const response = await fetch(
        'http://auto-market-backend:8080/exchanges?CurrencyShortNameA=USD&CurrencyShortNameB=UAH',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwtStr,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (!data?.data) {
        throw new Error("Invalid exchange rate response");
      }
      const rate = parseFloat(data.data);
      setPriceInUah(Number((car.price * rate).toFixed(0)));
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  };

  const handleLikeToggle = async () => {
    const url = liked
      ? `http://auto-market-backend:8080/vehicles/${car.id}/like/false`
      : `http://auto-market-backend:8080/vehicles/${car.id}/like/true`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtStr
      },
    });
    if (response.ok) {
      setLiked(!liked);
    } else {
      console.error("Failed to update like status.");
    }
  };

  return (
    <div className="body">
      <WrappedHeader />
      {loading ? (
        <div className="text-center">
        </div>
      ) : (
        <div className="container mt-5" style={{ maxWidth: "88%" }}>
          <div className="row">
            <div className="col-md-8">
              <div className="photo-wrapper br16" style={{height: "80vh"}}>
                <div
                  className="photo-container"
                  style={{transform: `translateX(-${currentPhotoIndex * 100}%)`}}
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
              <div className="card mt-3 br16 box-shadow-12 mb-5">
                <div className="card-body">
                  <h5 className="card-title">Description</h5>
                  <p>{car?.description || "N/A"}</p>
                </div>
              </div>
            </div>
            <div className="col-4">
              <div className="sticky-top" style={{ position: 'sticky', top: 0, zIndex: 0 }}>
                <div className="card br16 box-shadow-12">
                  <div className="card-body pb-0">
                    <div className="card-header-details">
                      <div class="card-header-details">
                        <h5>{car.modelName} {car.year}</h5>
                        <span class="badge rounded-pill text-bg-secondary">{car.usageStatus}</span>
                      </div>
                      <span onClick={handleLikeToggle} style={{ cursor: 'pointer' }}>
                        <div className={`heart-circle ${liked ? 'liked' : ''}`} onClick={() => setLiked(!liked)}>
                          {liked ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#CC3737" className="bi bi-heart-fill heart" viewBox="0 0 16 16">
                              <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-heart heart" viewBox="0 0 16 16">
                              <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                            </svg>
                          )}
                        </div>
                      </span>
                    </div>
                    <div>
                      <h5 className="card-title" style={{ color: "#228B22", fontSize: "22px", fontFamily: "Arial, sans-serif", fontWeight: "bold" }}>
                        {car.price.toLocaleString("en-US").replace(/,/g, " ")} $
                        {priceInUah && (
                          <>
                            <span style={{ color: "grey", fontSize: "16px", fontFamily: "Arial, sans-serif", fontWeight: "normal", marginLeft: "5px" }}>
                              {" • "}
                            </span>
                            <span style={{ color: "grey", fontSize: "16px", fontFamily: "Arial, sans-serif", fontWeight: "normal", marginLeft: "5px" }}>
                              {priceInUah.toLocaleString("en-US").replace(/,/g, " ")} ₴
                            </span>
                          </>
                        )}
                      </h5>
                    </div>
                    <div className="col-md-6">
                      <p className="card-text car-field mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-building" viewBox="0 0 16 16" style={{ marginRight: "10px" }}>
                          <path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z" />
                          <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z" />
                        </svg>
                        <span>Company:&nbsp;</span>
                        {`${car.brandName}`}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="card-text car-field mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-car-front" viewBox="0 0 16 16" style={{ marginRight: "10px" }}>
                          <path d="M4 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0m10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM4.862 4.276 3.906 6.19a.51.51 0 0 0 .497.731c.91-.073 2.35-.17 3.597-.17s2.688.097 3.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 10.691 4H5.309a.5.5 0 0 0-.447.276" />
                          <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM4.82 3a1.5 1.5 0 0 0-1.379.91l-.792 1.847a1.8 1.8 0 0 1-.853.904.8.8 0 0 0-.43.564L1.03 8.904a1.5 1.5 0 0 0-.03.294v.413c0 .796.62 1.448 1.408 1.484 1.555.07 3.786.155 5.592.155s4.037-.084 5.592-.155A1.48 1.48 0 0 0 15 9.611v-.413q0-.148-.03-.294l-.335-1.68a.8.8 0 0 0-.43-.563 1.8 1.8 0 0 1-.853-.904l-.792-1.848A1.5 1.5 0 0 0 11.18 3z" />
                        </svg>
                        <span>Model:&nbsp;</span>
                        {`${car.modelName.split(' ').slice(1).join(' ')}`}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="card-text car-field mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-speedometer" viewBox="0 0 16 16" style={{ marginRight: "10px" }}>
                          <path d="M8 2a.5.5 0 0 1 .5.5V4a.5.5 0 0 1-1 0V2.5A.5.5 0 0 1 8 2M3.732 3.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707M2 8a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 8m9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5m.754-4.246a.39.39 0 0 0-.527-.02L7.547 7.31A.91.91 0 1 0 8.85 8.569l3.434-4.297a.39.39 0 0 0-.029-.518z" />
                          <path fill-rule="evenodd" d="M6.664 15.889A8 8 0 1 1 9.336.11a8 8 0 0 1-2.672 15.78zm-4.665-4.283A11.95 11.95 0 0 1 8 10c2.186 0 4.236.585 6.001 1.606a7 7 0 1 0-12.002 0" />
                        </svg>
                        <span>Mileage:&nbsp;</span>
                        {`${car.mileage.toLocaleString("en-US").replace(/,/g, " ")} km`}
                      </p>
                    </div>
                    <p className="card-text car-field">
                      <img src={gearboxIcon} alt="icon" width="18" height="18" style={{ marginRight: "10px" }} />
                      <span>Gearbox:&nbsp;</span>
                      {`${car.gearbox.charAt(0).toUpperCase() + car.gearbox.slice(1).toLowerCase()}`}
                    </p>
                    <p className="card-text car-field">
                      <img src={canisterIcon
                      } alt="icon" width="18" height="18" style={{ marginRight: "10px" }} />
                      <span>Engine:&nbsp;</span>
                      {`${car.engine}`}
                    </p>
                    <div className="row">
                      <div className="col-md-6">
                        <p>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-gear" viewBox="0 0 16 16" style={{ marginRight: "10px" }}>
                            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
                            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
                          </svg>
                          <span>Body type:&nbsp;</span>
                          {car?.bodyType || "N/A"}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16" style={{ marginRight: "10px" }}>
                            <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                          </svg>
                          {car?.region || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card card-body mt-3 br16 box-shadow-12">
                  <div className="d-flex align-items-center">
                    <img
                      className="rounded-circle"
                      src={
                        user.profileImageUrl
                          ? `data:image/png;base64,${user.profileImageUrl}`
                          : "https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                      }
                      alt="Profile"
                      style={{
                        objectFit: "cover",
                        width: "48px",
                        height: "48px",
                        marginRight: "10px",
                      }}
                    />
                    <div className="d-flex flex-column">
                      <span className="fw-bold">{user.firstName} {user.lastName}</span>
                      <span className="text-gray">Seller</span>
                    </div>
                  </div>
                  <p class="seller-contact mt-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone-fill" viewBox="0 0 16 16" style={{ marginRight: "10px" }}>
                      <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                    </svg>
                    Phone number: {car.phoneNumber}</p>
                  <p class="seller-email">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16" style={{ marginRight: "10px" }}>
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                    </svg>
                    Email: {user.email}</p>
                  <p class="seller-role">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16" style={{ marginRight: "10px" }}>
                      <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                      <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                    </svg>
                    Region: {car.region}</p>
                  <button className="btn btn-primary btn-blue-color br24" onClick={handleClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-chat-right-text" viewBox="0 0 16 16">
                      <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z" />
                      <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6m0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
                    </svg>
                    &nbsp; Send message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <WrappedFooter />
    </div>
  );
};
export default SaleCar;
