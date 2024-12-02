import React, { useState } from "react"; 

const CarStateFilter = ({ onRadioChange }) => {
  const [selectedRadio, setSelectedRadio] = useState("btnradio1");

  const handleRadioChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedRadio(event.target.id);
    onRadioChange(selectedValue);
  };

  return (
    <div className="mb-3">
      <div
        className="btn-group"
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="btnradio1"
          autoComplete="off"
          checked={selectedRadio === "btnradio1"}
          onChange={handleRadioChange}
          value="ALL"
        />
        <label className="btn btn-outline-primary" htmlFor="btnradio1">
          All
        </label>

        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="btnradio2"
          autoComplete="off"
          checked={selectedRadio === "btnradio2"}
          onChange={handleRadioChange}
          value="NEW" // Assign value
        />
        <label className="btn btn-outline-primary" htmlFor="btnradio2">
          NEW
        </label>

        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="btnradio3"
          autoComplete="off"
          checked={selectedRadio === "btnradio3"}
          onChange={handleRadioChange}
          value="USED" // Assign value
        />
        <label className="btn btn-outline-primary" htmlFor="btnradio3">
          USED
        </label>
      </div>
    </div>
  );
};

export default CarStateFilter;