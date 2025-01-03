import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ApproveCar from "../../UI/manager/approveCar/ApproveCar";
import Header from "../../UI/manager/Header";
import Footer from "../../UI/manager/Footer";

const ApproveCarPage = () => {
  const [cars, setCars] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const jwtStr = localStorage.getItem('jwtToken');

  const location = useLocation();
  const navigate = useNavigate();

  const getPageAndSizeFromUrl = () => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page")) || 0;
    const size = parseInt(params.get("size")) || 5;
    return { page, size };
  };

  const fetchData = async (page = 0, size = 5) => {
    const url = `http://localhost:8080/vehicles/to_approve?page=${page}&size=${size}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwtStr
      },
      credentials: "include",
    });
    const data = await response.json();
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

  return (
    <div>
      <Header />
      <div className="p-5">
  {cars.length > 0 ? (
    <>
      {cars.map((car) => (
        <ApproveCar key={car.id} car={car} removeCarFromList={removeCarFromList} />
      ))}
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
    <p>No cars to approve.</p>
  )}
</div>
      <Footer />
    </div>
  );
};

export default ApproveCarPage;
