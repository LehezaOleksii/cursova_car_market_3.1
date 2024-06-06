import React from "react";

const CarState = ({ selectedRadio, onRadioChange }) => {
  const handleRadioChange = (event) => {
    onRadioChange(event.target.value);
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
          checked={selectedRadio === "NEW"}
          onChange={handleRadioChange}
          value="NEW"
        />
        <label className="btn btn-outline-primary" htmlFor="btnradio1">
          New
        </label>

        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="btnradio2"
          autoComplete="off"
          checked={selectedRadio === "USED"}
          onChange={handleRadioChange}
          value="USED"
        />
        <label className="btn btn-outline-primary" htmlFor="btnradio2">
          Used
        </label>
      </div>
    </div>
  );
};

export default CarState;
