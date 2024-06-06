import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../UI/admin/Header";
import Footer from "../../UI/admin/Footer";

const UpdateManager = () => {
  const { id: adminId } = useParams();
  const { managerId: managerId } = useParams();
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const navigate = useNavigate();
  const [managerData, setManagerData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
  });

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    setManagerData((prevData) => ({
      ...prevData,
      firstName: value,
    }));
    setFirstNameError("");
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    setManagerData((prevData) => ({
      ...prevData,
      lastName: value,
    }));
    setLastNameError("");
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setManagerData((prevData) => ({
      ...prevData,
      email: value,
    }));
    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setManagerData((prevData) => ({
      ...prevData,
      password: value,
    }));
    setPasswordError("");
  };

  const validateForm = () => {
    let isValid = true;
    if (!/^[a-zA-Z]+$/.test(managerData.firstName)) {
      setFirstNameError("First name should contain only letters.");
      isValid = false;
    }
    if (!/^[a-zA-Z]+$/.test(managerData.lastName)) {
      setLastNameError("Last name should contain only letters.");
      isValid = false;
    }
    if (!managerData.email || managerData.email.trim() === "") {
      setEmailError("Email is required.");
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(managerData.email)) {
      setEmailError("Invalid email format.");
      isValid = false;
    }
    if (!managerData.password || managerData.password.trim() === "") {
      setPasswordError("Password is required.");
      isValid = false;
    }
    return isValid;
  };
  
  useEffect(() => {
    const fetchManagerData = async () => {
      const url = `http://localhost:8080/admins/${adminId}/managers/${managerId}`;
      const response = await fetch(url);
      const manager = await response.json();
      setManagerData(manager);
      setProfileImageUrl(manager.profileImageUrl);
    };

    fetchManagerData();
  }, []); 

  const handleSave = async () => {
      const url = `http://localhost:8080/admins/${adminId}/managers/${managerId}`;
      if(validateForm()){
        const manager = {
          firstName: managerData.firstName,
          lastName: managerData.lastName,
          password: managerData.password,
          email: managerData.email,
          profileImageUrl: profileImageUrl && !isBase64(profileImageUrl) ? await convertImageToBase64(profileImageUrl) : profileImageUrl,
        };
        const response =  await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(manager),
        }); 
        if(response.ok){
          navigate(`/admin/${adminId}`);
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
    if (typeof image === 'string') {
      // If it's a URL, fetch the image and convert it to base64
      fetch(image)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(",")[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
        .catch(reject);
    } else if (image instanceof File) {
      // If it's a File object, directly read it as base64
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(image);
    } else {
      reject(new Error('Invalid image type'));
    }
  });
};

  return (
    <div className="body">
      <Header/>
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 ">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Cabinet</h2>
              <input
      type="file"
      className="form-control"
      id="carPhoto"
      accept="image/*"
      onChange={(e) => {
        const imageUrl = URL.createObjectURL(e.target.files[0]);
        setProfileImageUrl(imageUrl);
      }}
    />

    <div
    className="card-img rounded-circle"
    style={{
      width: "100px",
      height: "100px",
      backgroundColor: "#ccc",
      backgroundImage: `url(${profileImageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {profileImageUrl && (
      <img
      className="rounded-circle"
      src={profileImageUrl ? `data:image/png;base64,${profileImageUrl}` : 'default-image-url'}
        style={{ objectFit: "cover",      
        width: "100px",
        height: "100px" }}
      />
    )}
  </div> 
              <div className="mb-3 ">
                <label htmlFor="firstName" className="form-label">
                  Firstname
                </label>
                <input
                  type="text"
                  className={`form-control ${firstNameError && "is-invalid"}`}
                  id="firstName"
                  value={managerData.firstName}
                  onChange={(e) =>
                    handleFirstNameChange(e)
                  }
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
                  value={managerData.lastName}
                  onChange={(e) =>
                    handleLastNameChange(e)
                  }
                  placeholder="Lastname"
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
                  value={managerData.email}
                  onChange={(e) =>
                    handleEmailChange(e)
                  }
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
                  type="password"
                  className={`form-control ${passwordError && "is-invalid"}`}
                  id="password"
                  value={managerData.password}
                  onChange={(e) =>
                    handlePasswordChange(e)
                  }
                  placeholder="Password"
                />
                {passwordError && (
                  <div className="invalid-feedback">{passwordError}</div>
                )}
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

export default UpdateManager;
