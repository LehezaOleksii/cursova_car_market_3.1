import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cabinet = ({ Header, Footer }) => {
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const navigate = useNavigate();
  const [clientData, setClientData] = useState({
    firstname: "",
    lastname: ""
  });

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const jwtStr = localStorage.getItem("jwtToken");
  const id = localStorage.getItem("id");
  const role = localStorage.getItem("role");

  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    setClientData((prevData) => ({
      ...prevData,
      firstname: value,
    }));
    setFirstNameError("");
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    setClientData((prevData) => ({
      ...prevData,
      lastname: value,
    }));
    setLastNameError("");
  };

  const validateForm = () => {
    let isValid = true;
    if (!/^[a-zA-Z]+$/.test(clientData.firstname)) {
      setFirstNameError("First name should contain only letters.");
      isValid = false;
    }
    if (!/^[a-zA-Z]+$/.test(clientData.lastname)) {
      setLastNameError("Last name should contain only letters.");
      isValid = false;
    }
    return isValid;
  };

  useEffect(() => {
    const fetchClientData = async () => {
      const url = `http://localhost:8080/users/cabinet`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + jwtStr,
        },
        credentials: "include",
      });
      const client = await response.json();
      setClientData(client);
      setProfileImageUrl(client.profileImageUrl);
    };

    fetchClientData();
  }, [id, jwtStr]); 

  const handleSave = async () => {
    const url = `http://localhost:8080/users/cabinet`;
    if (validateForm()) {
      const client = {
        firstname: clientData.firstname,
        lastname: clientData.lastname,
        profileImageUrl:
          profileImageUrl && !isBase64(profileImageUrl)
            ? await convertImageToBase64(profileImageUrl)
            : profileImageUrl,
      };
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + jwtStr,
        },
        credentials: "include",
        body: JSON.stringify(client),
      });
      switch (role) {
        case 'ROLE_CLIENT':
          window.location.href = '/client';
          break;
        case 'ROLE_MANAGER':
          window.location.href = '/manager';
          break;
        case 'ROLE_ADMIN':
          window.location.href = '/admin';
          break;
        default:
          window.location.href = '/login';
          break;
      }
    }
  };

  const isBase64 = (str) => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  const convertImageToBase64 = (image) => {
    return new Promise((resolve, reject) => {
      if (typeof image === "string") {
        fetch(image)
          .then((response) => response.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
          .catch(reject);
      } else if (image instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      } else {
        reject(new Error("Invalid image type"));
      }
    });
  };

  return (
    <div className="body">
      <Header />
      <div className="row justify-content-center mt-5">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body text-center">
              <h2 className="card-title">Cabinet</h2>
              <div className="mb-4 text-center">
                <div
                  className="card-img rounded-circle shadow-lg mx-auto"
                  style={{
                    width: "150px",
                    height: "150px",
                    backgroundColor: "#f0f0f0",
                    backgroundImage: `url(${profileImageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <label className="btn btn-primary btn-sm mt-3">
                  Upload Profile Image
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const imageUrl = URL.createObjectURL(e.target.files[0]);
                      setProfileImageUrl(imageUrl);
                    }}
                  />
                </label>
              </div>

              <div className="text-start">
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    Firstname
                  </label>
                  <input
                    type="text"
                    className={`form-control ${firstNameError && "is-invalid"}`}
                    id="firstName"
                    value={clientData.firstname}
                    onChange={(e) => handleFirstNameChange(e)}
                    placeholder="Firstname"
                  />
                  {firstNameError && (
                    <div className="invalid-feedback">{firstNameError}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">
                    Lastname
                  </label>
                  <input
                    type="text"
                    className={`form-control ${lastNameError && "is-invalid"}`}
                    id="lastName"
                    value={clientData.lastname}
                    onChange={(e) => handleLastNameChange(e)}
                    placeholder="Lastname"
                  />
                  {lastNameError && (
                    <div className="invalid-feedback">{lastNameError}</div>
                  )}
                </div>
              </div>

              <div className="d-grid">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSave()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cabinet;
