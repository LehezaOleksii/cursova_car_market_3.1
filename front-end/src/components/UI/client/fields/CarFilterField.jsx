import React from "react";

const CarFilterField = ({ type, value, onChange, placeholder }) => {
  return (
    <div className="mb-3">
      <input
        type={type}
        className="form-control"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ borderRadius: "12px" }}
      />
    </div>
  );
};

export default CarFilterField;
