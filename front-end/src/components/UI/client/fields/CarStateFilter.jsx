import React from "react"; 
import "./CarStateFilter.css"; // Import the custom CSS

const CarStateFilter = ({ selectedRadio, onRadioChange }) => {
  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    onRadioChange(selectedValue);
  };

  return (
    <div className="mb-3">
      <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="btnradio1"
          autoComplete="off"
          checked={selectedRadio === "ALL"}
          onChange={handleRadioChange}
          value="ALL"
        />
        <label className={`btn btn-outline-primary ${selectedRadio === "ALL" ? "selected-radio" : ""}`} htmlFor="btnradio1">
          All
        </label>

        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="btnradio2"
          autoComplete="off"
          checked={selectedRadio === "NEW"}
          onChange={handleRadioChange}
          value="NEW"
        />
        <label className={`btn btn-outline-primary ${selectedRadio === "NEW" ? "selected-radio" : ""}`} htmlFor="btnradio2">
          New
        </label>

        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="btnradio3"
          autoComplete="off"
          checked={selectedRadio === "USED"}
          onChange={handleRadioChange}
          value="USED"
        />
        <label className={`btn btn-outline-primary ${selectedRadio === "USED" ? "selected-radio" : ""}`} htmlFor="btnradio3">
          Used
        </label>
      </div>
    </div>
  );
};

export default CarStateFilter;
