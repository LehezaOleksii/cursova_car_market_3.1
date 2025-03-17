import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CarFilter from "../../UI/client/dashboard/CarFilter";
import SaledCars from "../../UI/client/dashboard/SaledCars";
import WrappedHeader from "../../WrappedHeader";
import WrappedFooter from "../../WrappedFooter";

const Dashboard = () => {
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterState, setFilterState] = useState({});
  const pageSize = 10;
  const location = useLocation();
  const jwtStr = localStorage.getItem("jwtToken");

  const getPageAndSizeFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return {
      page: parseInt(params.get("page")) || 0,
      size: parseInt(params.get("size")) || pageSize,
    };
  };

  const fetchData = async (page = 0, size = pageSize, filters = {}) => {
    const queryParams = new URLSearchParams(filters);
    queryParams.append("vehicleStatus", "POSTED");
    queryParams.append("page", page);
    queryParams.append("size", size);

    try {
      const response = await fetch(
        `http://auto-market-backend:8080/vehicles/filter?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwtStr,
          },
        }
      );
      const data = await response.json();
      setCars(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  useEffect(() => {
    const { page, size } = getPageAndSizeFromUrl();
    fetchData(page, size, filterState);
  }, [location.search, filterState]);

  const handlePageChange = (page) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="body">
      <WrappedHeader />
      <div className="dashboard">
        <CarFilter
          setCars={setCars}
          setTotalPages={setTotalPages}
          setCurrentPage={setCurrentPage}
          setFilterState={setFilterState}
        />
        <SaledCars cars={cars} />
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4 mb-4">
            <button
              className="btn btn-outline-primary mx-1"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 0}
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
              disabled={currentPage >= totalPages - 1}
            >
              Next &gt;
            </button>
          </div>
        )}
      </div>
      <WrappedFooter />
    </div>
  );
};

export default Dashboard;
