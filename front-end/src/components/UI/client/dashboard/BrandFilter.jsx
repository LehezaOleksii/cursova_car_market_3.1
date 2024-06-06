import React from "react"; 

const BrandFilter = (brand) => {
  return (
    <div>
       {brand.image}
       {brand.name}
    </div>
  );
};

export default BrandFilter;
