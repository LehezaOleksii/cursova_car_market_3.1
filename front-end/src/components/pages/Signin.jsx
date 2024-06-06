import {React, useState} from "react"; 
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    console.log('Email:', email);
    console.log('Password:', password);
  };

  const signIn = async () => {
    const user = {
      email,
      password
    };
  
    try {
      const response = await fetch("http://localhost:8080/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
  
      if (response.ok) {
        const userData = await response.json();
        const role = userData.userRole;
  
        switch (role) {
          case "CLIENT":
            navigate(`/client/${userData.id}`);
            break;
          case "MANAGER":
            navigate(`/manager/${userData.id}/users`);
            break;
          case "ADMIN":
            navigate(`/admin/${userData.id}`);
            break;
          default:
            alert("User with this data does not exist at the system");
        }
      } else {
        alert("Signin failed");
      }
    } catch (error) {
      alert(`Signin error: ${error.message}`);
    }
  };
  
  

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Sign In</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Email address"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Password"
                  />
                              <p className="mt-3">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary">
                      Sign Up
                    </Link>
                  </p>
                </div> 
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary d-grid gap-2 col-8 mx-auto"   onClick={() => signIn()}>
                    Login
                  </button>
                </div> 
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
