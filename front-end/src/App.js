import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/pages/client/Dashboard";
import LikedCars from "./components/pages/client/LikedCars";
import Chat from "./components/pages/client/Chats";
import Login from "./components/login/Login";
import Signup from "./components/login/Signup";
import SaleCar from "./components/pages/client/SaleCar";
import ClientCabinet from "./components/pages/client/ClientCabinet";
import AddAuto from "./components/pages/client/AddAuto";
import MyCars from "./components/pages/client/MyCars";
import ClientChangeAuto from "./components/pages/client/ClientChangeAuto";
import AdvancedFilter from "./components/UI/client/dashboard/AdvancedFilter";
import { Navigate } from "react-router-dom";

import ChangeAuto from "./components/pages/manager/ChangeAuto";
import ManagerDashboard from "./components/pages/manager/ManagerDashboard";
import Autos from "./components/pages/manager/Autos";
import ApproveCarPage from "./components/pages/manager/ApproveCarPage";
import ManagerCabinet from "./components/pages/manager/ManagerCabinet";
import CarDetails from "./components/pages/manager/car_details/CarDetails";


import AdminDashboard from "./components/pages/admin/AdminDashboard";
import AdminCabinet from "./components/pages/admin/AdminCabinet";
import UpdateManager from "./components/pages/admin/UpdateManager";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import "./Styles/style.css";
import ApproveManagersPage from "./components/pages/admin/ApproveManager";
import ManagerMyCars from "./components/pages/manager/ManagerMyCars";
import ManagerAddAuto from "./components/pages/manager/ManagerAddAuto";
import ManagerChangeAuto from "./components/pages/manager/ChangeAuto";
import ManagerViewCars from "./components/pages/manager/ManagerViewCars";
import ManagerSaleCar from "./components/pages/manager/ManagerSaleCar";
import SignOut from './components/login/SignOut';
import ForgotPassword from "./components/login/ForgotPassword";
import OtpVerification from "./components/login/OtpVerification";
import ChangePassword from "./components/login/ChangePassword";
import SignupSuccess from "./components/login/SignupSuccess";
import ConfirmEmail from "./components/login/ConfirmEmail";
import ChangeEmailSuccess from "./components/login/ChangeEmailSuccess";

const App = () => {

  const expiration = parseInt(localStorage.getItem('jwtTokenExpiration'), 10);
  var isLoggedIn = false;
  if (Date.now() > expiration) {
    isLoggedIn = false;
  } else {
    isLoggedIn = true;
  }

  const wrapPrivateRoute = (element, user, redirect, requiredRole) => {
    return (
      <PrivateRoute user={user} redirect={redirect} requiredRole={requiredRole}>
        {element}
      </PrivateRoute>
    );
  };

  return (
    <Routes>
      {/* login */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot-password-otp" element={<OtpVerification />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/signup-success" element={<SignupSuccess />} />
      <Route path="/change-email-success" element={<ChangeEmailSuccess />} />
      <Route path="/confirm-email" element={<ConfirmEmail />} />
      <Route path="/signout" element={wrapPrivateRoute(<SignOut />)} />

      {/* client */}
      <Route path="/dashboard" element={wrapPrivateRoute(<Dashboard />, isLoggedIn, 'client', 'ROLE_CLIENT')} />
      <Route path="/car/:carId" element={wrapPrivateRoute(<SaleCar />, isLoggedIn, 'saleCar', 'ROLE_CLIENT')} />
      <Route path="/cabinet" element={wrapPrivateRoute(<ClientCabinet />, isLoggedIn, 'cabinet', 'ROLE_CLIENT')} />
      <Route path="/add_auto" element={wrapPrivateRoute(<AddAuto />, isLoggedIn, 'addAuto', 'ROLE_CLIENT')} />
      <Route path="/change_car/:carId" element={wrapPrivateRoute(<ClientChangeAuto />, isLoggedIn, 'clientChangeAuto', 'ROLE_CLIENT')} />
      <Route path="/my_cars" element={wrapPrivateRoute(<MyCars />, isLoggedIn, 'myCars', 'ROLE_CLIENT')} />
      <Route path="/advanced_filter" element={wrapPrivateRoute(<AdvancedFilter />, isLoggedIn, 'advanced_filter', 'ROLE_CLIENT')} />
      <Route path="/cars" element={wrapPrivateRoute(<LikedCars />, isLoggedIn, 'LikedCars', 'ROLE_CLIENT')} />

      {/* manager */}
      <Route path="/users" element={wrapPrivateRoute(<ManagerDashboard />, isLoggedIn, 'ManageDashboard', 'ROLE_MANAGER')} />
      <Route path="/cars/managment" element={wrapPrivateRoute(<ApproveCarPage />, isLoggedIn, 'ApproveCarPage', 'ROLE_MANAGER')} />
      <Route path="/cars/components" element={wrapPrivateRoute(<CarDetails />, isLoggedIn, 'CarsDetails', 'ROLE_MANAGER')} />

      {/* admin */}
      <Route path="/users" element={wrapPrivateRoute(<AdminDashboard />, isLoggedIn, null, 'ROLE_ADMIN')} />
      <Route path="/admin/approve/managers" element={wrapPrivateRoute(<ApproveManagersPage />, isLoggedIn, 'ApproveManagerPage', 'ROLE_ADMIN')} />
      <Route path="/admin/update/managers/:managerId" element={wrapPrivateRoute(<UpdateManager />, isLoggedIn, 'UpdateRoute', 'ROLE_ADMIN')} />
      <Route path="/admin/cabinet" element={wrapPrivateRoute(<AdminCabinet />, isLoggedIn, 'AdminCabinet', 'ROLE_ADMIN')} />

      {/* chat */}
      <Route path="/chats" element={wrapPrivateRoute(<Chat />, isLoggedIn, 'Chats', 'ROLE_CLIENT')} />
      <Route path="*" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
