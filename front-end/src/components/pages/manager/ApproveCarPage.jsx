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
    const size = parseInt(params.get("size")) || 5;
    return { page, size };
  };

  const fetchData = async (page = 0, size = 5) => {
    const url = `http://localhost:8080/vehicles?page=${page}&size=${size}`;
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
    fetchData(page, size);
  }, [location.search]);

  const handlePageChange = (page) => {
    const { size } = getPageAndSizeFromUrl();
    navigate(`?page=${page}&size=${size}`);
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
      <div className="card-container p-5">
      <CarFilter setCars={setCars} />
      {cars.length > 0 ? (
          <>
            {onModerationCars.length > 0 && (
              <div>
                <hr />
                <h4 className="text-center">Cars on Moderation</h4>
                <hr />
                {onModerationCars.map((car) => (
                  <ApproveCar key={car.id} car={car} removeCarFromList={removeCarFromList} />
                ))}
              </div>
            )}

            {postedCars.length > 0 && (
              <div>
                <hr />
                <h4 className="text-center">Posted Cars</h4>
                <hr />
                {postedCars.map((car) => (
                  <ApproveCar key={car.id} car={car} removeCarFromList={removeCarFromList} />
                ))}
              </div>
            )}

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
          <p>No cars to approve.</p>
        )}
      </div>
      <WrappedFooter />
    </div>
  );
};

export default ApproveCarPage;
