import React, { useState } from "react"; 

const CarStateFilter = ({ onRadioChange }) => {
  
  const [selectedRadio, setSelectedRadio] = useState("btnradio1");

  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.id);
    onRadioChange(event.target.value);
  };
  return (
    <div className="mb-3">
      <div
        className="btn-group"
        role="group"
        aria-label="Basic radio toggle button group"
      >
        <input type="radio" className="btn-check" name="btnradio" id="btnradio1" autoComplete="off" checked={selectedRadio === "btnradio1" } onChange={handleRadioChange} value = "ALL"/>
        <label className="btn btn-outline-primary" htmlFor="btnradio1">
          All
        </label>

        <input type="radio" className="btn-check" name="btnradio" id="btnradio2" autoComplete="off" checked={selectedRadio === "btnradio2"} onChange={handleRadioChange} value = "NEW"/>
        <label className="btn btn-outline-primary" htmlFor="btnradio2">
          NEW
        </label>

        <input type="radio" className="btn-check" name="btnradio" id="btnradio3" autoComplete="off" checked={selectedRadio === "btnradio3"} onChange={handleRadioChange} value = "USED"/>
        <label className="btn btn-outline-primary" htmlFor="btnradio3">
          USED
        </label>
      </div>
    </div>
  );
};

export default CarStateFilter;
