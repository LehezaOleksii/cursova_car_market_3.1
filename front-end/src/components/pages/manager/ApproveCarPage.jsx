import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApproveCar from "../../UI/manager/approveCar/ApproveCar";
import WrappedHeader from "../../WrappedHeader";
import WrappedFooter from "../../WrappedFooter";
import CarFilter from "../../UI/manager/approveCar/CarFilter";

const ApproveCarPage = () => {
  const [cars, setCars] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const jwtStr = localStorage.getItem("jwtToken");

  const location = useLocation();
  const navigate = useNavigate();

  const getPageAndSizeFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page")) || 0;
    const size = parseInt(params.get("size")) || 10;
    return { page, size };
  };

  const getFiltersFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return {
      brandName: params.get("brandName") || "",
      modelName: params.get("modelName") || "",
      bodyType: params.get("bodyType") || "",
      region: params.get("region") || "",
      fromPrice: params.get("minPrice") || "",
      toPrice: params.get("maxPrice") || "",
      fromYear: params.get("minYear") || "",
      toYear: params.get("maxYear") || "",
      status: params.get("status") || "ALL",
    };
  };

  const fetchData = async (page = 0, size = 10, filters = {}) => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("size", size);
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });

    const url = `http://localhost:8080/vehicles/management/filter?${queryParams.toString()}`;

    const responseVehiclesOnModeration = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwtStr,
      },
      credentials: "include",
    });

    const data = await responseVehiclesOnModeration.json();
    setCars(data.content);
    setTotalPages(data.totalPages);
    setCurrentPage(data.number);
  };

  useEffect(() => {
    const { page, size } = getPageAndSizeFromUrl();
    const filters = getFiltersFromUrl();
    fetchData(page, size, filters);
  }, [location.search]);

  const handlePageChange = (page) => {
    const { size } = getPageAndSizeFromUrl();
    const filters = getFiltersFromUrl();
    navigate(`?page=${page}&size=${size}&${new URLSearchParams(filters).toString()}`);
    window.scrollTo(0, 0);
  };

  const removeCarFromList = (carId) => {
    setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
  };

  const isPreviousDisabled = currentPage <= 0;
  const isNextDisabled = currentPage >= totalPages - 1;

  const onModerationCars = cars.filter((car) => car.status === "ON_MODERATION");
  const postedCars = cars.filter((car) => car.status === "POSTED");

  return (
    <div>
      <WrappedHeader />
      <div className="card-container p-5 pt-4" style={{maxWidth: "1600px", marginLeft: "auto", marginRight: "auto"}}>
        <CarFilter
          setCars={setCars}
          page={currentPage}
          size={10}
        />
        {cars.length > 0 ? (
          <>
            <div className="d-flex flex-column align-items-center">
              {onModerationCars.length > 0 && (
                <div className="w-100">
                  <hr className="mt-2" />
                  <h4 className="text-center">Cars on Moderation</h4>
                  <hr className="mb-4" />
                  {onModerationCars.map((car) => (
                    <div className="col-9 mx-auto" key={car.id}>
                      <ApproveCar car={car} removeCarFromList={removeCarFromList} />
                    </div>
                  ))}
                </div>
              )}
              {postedCars.length > 0 && (
                <div className="w-100">
                  <hr className="mt-1" />
                  <h4 className="text-center">Posted Cars</h4>
                  <hr className="mb-4" />
                  {postedCars.map((car) => (
                    <div className="col-9 mx-auto" key={car.id}>
                      <ApproveCar car={car} removeCarFromList={removeCarFromList} />
                    </div>
                  ))}
                </div>
              )}
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
                  className={`btn ${page === currentPage ? "btn-primary" : "btn-outline-primary"} mx-1`}
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
          <div className="d-flex justify-content-center align-items-center mt-5">
            <p className="text-center">No cars found.</p>
          </div>
        )}
      </div>
      <WrappedFooter />
    </div>
  );
};

export default ApproveCarPage;
