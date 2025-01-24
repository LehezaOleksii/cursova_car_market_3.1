import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import WrappedHeader from "../../../WrappedHeader";
import WrappedFooter from "../../../WrappedFooter";
import BrandComponent from "./BrandComponent";
import ModelComponent from "./ModelComponent";
import EngineComponent from "./EngineComponent";
import BodyTypeComponent from "./BodyTypeComponent";
import "./CarDetails.css";

const CarDetails = () => {
  const [activeComponent, setActiveComponent] = useState("brand");

  return (
    <div>
      <WrappedHeader />
      <div className="car-details-container">
        <div className="menu">
          <ul>
            <li
              className={activeComponent === "brand" ? "active" : ""}
              onClick={() => setActiveComponent("brand")}
            >
              Brand
            </li>
            <li
              className={activeComponent === "model" ? "active" : ""}
              onClick={() => setActiveComponent("model")}
            >
              Model
            </li>
            <li
              className={activeComponent === "engine" ? "active" : ""}
              onClick={() => setActiveComponent("engine")}
            >
              Engine
            </li>
            <li
              className={activeComponent === "bodyType" ? "active" : ""}
              onClick={() => setActiveComponent("bodyType")}
            >
              Body Type
            </li>
          </ul>
        </div>
        <div className="form-container">
          {activeComponent === "brand" && <BrandComponent />}
          {activeComponent === "model" && <ModelComponent />}
          {activeComponent === "engine" && <EngineComponent />}
          {activeComponent === "bodyType" && <BodyTypeComponent />}
        </div>
      </div>

      <WrappedFooter />
    </div>
  );
};

export default CarDetails;
