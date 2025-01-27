import React from "react"; 

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
        <label className="btn btn-outline-primary" htmlFor="btnradio1">
          All
        </label>

        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="btnradio2"
          autoComplete="off"
          checked={selectedRadio === "POSTED"}
          onChange={handleRadioChange}
          value="POSTED"
        />
        <label className="btn btn-outline-primary" htmlFor="btnradio2">
          Posted
        </label>

        <input
          type="radio"
          className="btn-check"
          name="btnradio"
          id="btnradio3"
          autoComplete="off"
          checked={selectedRadio === "ON_MODERATION"}
          onChange={handleRadioChange}
          value="ON_MODERATION"
        />
        <label className="btn btn-outline-primary" htmlFor="btnradio3">
          On moderation
        </label>
      </div>
    </div>
  );
};

export default CarStateFilter;
