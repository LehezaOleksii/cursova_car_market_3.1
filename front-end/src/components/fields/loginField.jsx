import React from "react"; 

const LoginField = ({ type, value, onChange, placeholder }) => {
  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};
export default LoginField; 