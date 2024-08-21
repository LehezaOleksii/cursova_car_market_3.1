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
            navigate(`/client`);
            break;
          case "MANAGER":
            navigate(`/manager/users`);
            break;
          case "ADMIN":
            navigate(`/admin`);
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
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card mt-5">
            <div className="card-header text-center">
              <h3>Login</h3>
            </div>
            <div className="card-body">
              <form action="/auth/login" method="post">
                <div className="mb-2">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input type="text" className="form-control" id="username" name="username" placeholder="Enter your username" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" className="form-control" id="password" name="password" placeholder="Enter your password" required />
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="rememberMe" name="remember-me" />
                    <label htmlFor="rememberMe" className="form-check-label">Remember Me</label>
                  </div>
                  <div>
                    <a href="/auth/forgot-password">Forgot Password?</a>
                  </div>
                </div>
                <div className="d-grid mb-3">
                  <button type="submit" className="btn btn-primary btn-block btn-pill">Login</button>
                </div>
              </form>
            </div>
            <div className="card-footer text-center">
              <small className="text-muted">Don't have an account? <a href="/signup">Sign up</a></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default SignIn;
