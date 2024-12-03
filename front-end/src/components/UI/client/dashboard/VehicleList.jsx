import React, { useState } from "react";
import AdvancedFilter from "./AdvancedFilter";

const VehicleList = () => {
  const [filteredData, setFilteredData] = useState([]);

  return (
    <div>
      <AdvancedFilter onApplyFilter={handleApplyFilter} />
      <div>
        {filteredData.map((vehicle) => (
          <div key={vehicle.id}>{vehicle.brand}</div>
        ))}
      </div>
    </div>
  );
};

export default VehicleList;
