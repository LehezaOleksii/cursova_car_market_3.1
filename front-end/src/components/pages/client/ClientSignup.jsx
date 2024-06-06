import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("");

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [regionError, setRegionError] = useState("");

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
    setFirstNameError("");
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    setLastNameError("");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setRegionError("");
  };

  const validateForm = () => {
    let isValid = true;
    if (!/^[a-zA-Z]+$/.test(firstName)) {
      setFirstNameError("First name should contain only letters.");
      isValid = false;
    }
    if (!/^[a-zA-Z]+$/.test(lastName)) {
      setLastNameError("Last name should contain only letters.");
      isValid = false;
    }
    if (!email || email.trim() === "") {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Invalid email format.");
      isValid = false;
    }
    if (!password || password.trim() === "") {
      setPasswordError("Password is required.");
      isValid = false;
    }
    if (!/^[a-zA-Z]+$/.test(region)) {
      setRegionError("Region should contain only letters.");
      isValid = false;
    }
    return isValid;
  };

  const signUp = async () => {
    if (validateForm()) {
      const user = {
        firstName,
        lastName,
        email,
        password,
        region,
      };

        const response = await fetch("http://localhost:8080/clients/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        if (response.ok) {
          const createdClient = await response.json();
          navigate(`/client/${createdClient.id}`);
        }
    }
  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Sign Up</h2>
              <div>
              <div className="mb-3">
        <label htmlFor="firstName" className="form-label">
          First Name
        </label>
        <input
          type="text"
          className={`form-control ${firstNameError && "is-invalid"}`}
          id="firstName"
          value={firstName}
          onChange={handleFirstNameChange}
          placeholder="First name"
        />
        {firstNameError && (
          <div className="invalid-feedback">{firstNameError}</div>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="lastName" className="form-label">
          Last Name
        </label>
        <input
          type="text"
          className={`form-control ${lastNameError && "is-invalid"}`}
          id="lastName"
          value={lastName}
          onChange={handleLastNameChange}
          placeholder="Last name"
        />
        {lastNameError && (
          <div className="invalid-feedback">{lastNameError}</div>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="text"
          className={`form-control ${emailError && "is-invalid"}`}
          id="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
        />
        {emailError && (
          <div className="invalid-feedback">{emailError}</div>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="text"
          className={`form-control ${passwordError && "is-invalid"}`}
          id="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Password"
        />
        {passwordError && (
          <div className="invalid-feedback">{passwordError}</div>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="region" className="form-label">
          Region
        </label>
        <input
          type="text"
          className={`form-control ${regionError && "is-invalid"}`}
          id="region"
          value={region}
          onChange={handleRegionChange}
          placeholder="Region"
        />
        {regionError && (
          <div className="invalid-feedback">{regionError}</div>
        )}
      </div>
                <p>
                  Already have an account?{" "}
                  <Link to="/signin" className="text-primary">
                    Sign In
                  </Link>
                </p> 
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary d-grid gap-2 col-8 mx-auto"
                      onClick={() => signUp()}
                    >
                      Sign Up
                    </button>
                  </div> 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
