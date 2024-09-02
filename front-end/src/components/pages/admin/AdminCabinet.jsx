import React, { useState, useEffect } from "react";
import {useNavigate } from "react-router-dom";
import Header from "../../UI/admin/Header";
import Footer from "../../UI/admin/Footer";
import getCsrfToken from "../../../csrf";

const AdminCabinet = () => {
  const csrfToken = getCsrfToken();
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState({
    firstname: "",
    lastname: "",
    region: ""
  });

  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const jwtStr = localStorage.getItem('jwtToken');
  const id = localStorage.getItem('id');

  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    setAdminData((prevData) => ({
      ...prevData,
      firstname: value,
    }));
    setFirstNameError("");
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    setAdminData((prevData) => ({
      ...prevData,
      lastname: value,
    }));
    setLastNameError("");
  };

  const handleRegionChange = (e) => {
    const value = e.target.value;
    setAdminData((prevData) => ({
      ...prevData,
      region: value,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    if (!/^[a-zA-Z]+$/.test(adminData.firstname)) {
      setFirstNameError("First name should contain only letters.");
      isValid = false;
    }
    if (!/^[a-zA-Z]+$/.test(adminData.lastname)) {
      setLastNameError("Last name should contain only letters.");
      isValid = false;
    }
    return isValid;
  };
  
  useEffect(() => {
    const fetchAdminData = async () => {
      const url = `http://localhost:8080/clients/cabinet/${id}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + jwtStr,
        },
        credentials: 'include',
      });      
      const admin = await response.json();
      setAdminData(admin);
      setProfileImageUrl(admin.profileImageUrl);
    };
    fetchAdminData();
  }, []); 

  const handleSave = async () => {
      if(validateForm()){
        const admin = {
          firstname: adminData.firstname,
          lastname: adminData.lastname,
          region: adminData.region,
          profileImageUrl: profileImageUrl && !isBase64(profileImageUrl) ? await convertImageToBase64(profileImageUrl) : profileImageUrl,
        };
        const url = `http://localhost:8080/clients/cabinet/${id}`;
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtStr,
            'X-XSRF-TOKEN': csrfToken 
          },
          credentials: 'include',
          body: JSON.stringify(admin)
        }); 
        if(response.ok){
          navigate(`/admin`);
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
      <meta name="_csrf" content="${_csrf.token}"/>
      <meta name="_csrf_header" content="${_csrf.headerName}"/>
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
                  id="firstname"
                  value={adminData.firstname}
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
                <label htmlFor="lastname" className="form-label">
                  Lastname
                </label>
                <input
                  type="text"
                  className={`form-control ${lastNameError && "is-invalid"}`}
                  id="lastName"
                  value={adminData.lastname}
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
                <label htmlFor="region" className="form-label">
                  Region
                </label>
                <input
                  type="region"
                  className={`form-control`}
                  id="region"
                  value={adminData.region}
                  onChange={(e) =>
                    handleRegionChange(e)
                  }
                  placeholder="Region"
                />
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

export default AdminCabinet;
