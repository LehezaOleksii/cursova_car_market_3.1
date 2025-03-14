import React, { useState, useEffect } from "react";

const Cabinet = ({ Header, Footer }) => {
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [clientData, setClientData] = useState({
    firstname: "",
    lastname: ""
  });

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emialError, setEmailError] = useState("");
  const jwtStr = localStorage.getItem("jwtToken");
  const id = localStorage.getItem("id");

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

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setClientData((prevData) => ({
      ...prevData,
      email: value,
    }));
    setEmailError("");
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
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientData.email)) {
      setEmailError("Please enter a valid email address.");
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
        email: clientData.email,
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

      const data = await response.json();

      if (response.ok) {
        const isEmailChanged = data.data === 'true';
        if (!isEmailChanged) {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/change-email-success';
        }
      } else {
        if (data.data === "This email already taken.") {
          setEmailError(data.data);
        } else {
          console.error("Failed to update user information.");
        }
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
          <div className="card br24 mb-4 box-shadow-12">
            <div className="card-body text-center">
              <h2 className="card-title">Cabinet</h2>
              <div className="mb-4 text-center">
                <div className="card-img rounded-circle shadow-lg mx-auto" style={{
                  width: "150px",
                  height: "150px",
                  backgroundColor: "#f0f0f0",
                  backgroundImage: `url(${profileImageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}>
                  {profileImageUrl ? (
                    <img
                      src={profileImageUrl ? `data:image/png;base64,${profileImageUrl}` : 'default-image-url'}
                      className="rounded-circle"
                      width="150"
                      height="150"
                    />
                  ) : (
                    <img
                      src={"https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"}
                      className="rounded-circle"
                      width="150"
                      height="150"
                      alt="Default Profile"
                    />
                  )}
                </div>
                <label className="btn btn-primary btn-sm mt-3 br24 w-25 box-shadow-06">
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
              <div className="text-start" style={{ marginBottom: "35px" }}>
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    First name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${firstNameError && "is-invalid"}`}
                    id="firstName"
                    value={clientData.firstname}
                    onChange={(e) => handleFirstNameChange(e)}
                    placeholder="Firstname"
                    style={{
                      borderRadius: "18px",
                      boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.06)",
                      transition: "box-shadow 0.3s ease",
                      padding: "8px 16px",
                      border: "1px solid #ced4da",
                      outline: "none",
                    }}
                    onFocus={(e) => (e.target.style.boxShadow = "5px 5px 15px rgba(0, 0, 0, 0.1)")}
                    onBlur={(e) => (e.target.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.06)")}
                  />
                  {firstNameError && (
                    <div className="invalid-feedback">{firstNameError}</div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">
                    Last name
                  </label>
                  <input
                    type="text"
                    className={`form-control ${lastNameError && "is-invalid"}`}
                    id="lastNmae"
                    value={clientData.lastname}
                    onChange={(e) => handleLastNameChange(e)}
                    placeholder="Last name"
                    style={{
                      borderRadius: "18px",
                      boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.06)",
                      transition: "box-shadow 0.3s ease",
                      padding: "8px 16px",
                      border: "1px solid #ced4da",
                      outline: "none",
                    }}
                    onFocus={(e) => (e.target.style.boxShadow = "5px 5px 15px rgba(0, 0, 0, 0.1)")}
                    onBlur={(e) => (e.target.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.06)")}
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
                    className={`form-control ${emialError && "is-invalid"}`}
                    id="email"
                    value={clientData.email}
                    onChange={(e) => handleEmailChange(e)}
                    placeholder="Email"
                    style={{
                      borderRadius: "18px",
                      boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.06)",
                      transition: "box-shadow 0.3s ease",
                      padding: "8px 16px",
                      border: "1px solid #ced4da",
                      outline: "none",
                    }}
                    onFocus={(e) => (e.target.style.boxShadow = "5px 5px 15px rgba(0, 0, 0, 0.1)")}
                    onBlur={(e) => (e.target.style.boxShadow = "5px 5px 10px rgba(0, 0, 0, 0.06)")}
                  />
                  {emialError && (
                    <div className="invalid-feedback">{emialError}</div>
                  )}
                </div>
              </div>
              <div className="d-grid">
                <button
                  type="button"
                  className="btn btn-primary br24 w100 box-shadow-06"
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
