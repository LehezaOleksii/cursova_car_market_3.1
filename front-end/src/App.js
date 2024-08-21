import React from "react";
import {Routes, Route } from "react-router-dom"; 
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/pages/client/Dashboard";
import Login from "./components/login/Login";
import Signup from "./components/login/Signup";
import SaleCar from "./components/pages/client/SaleCar";
import Cabinet from "./components/pages/client/Cabinet";
import AddAuto from "./components/pages/client/AddAuto";
import MyCars from "./components/pages/client/MyCars";
import ClientChangeAuto from "./components/pages/client/ClientChangeAuto";


import ChangeAuto from "./components/pages/manager/ChangeAuto";
import ManagerDashboard from "./components/pages/manager/ManagerDashboard";
import Autos from "./components/pages/manager/Autos";
import ApproveCarPage from "./components/pages/manager/ApproveCarPage";
import ManagerCabinet from "./components/pages/manager/ManagerCabinet";

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
import Chat from "./components/pages/Chat";
import SignOut from './components/login/SignOut';

const App = () => {

  const isLoggedIn = localStorage.getItem('jwtToken') ? true : false;

  const wrapPrivateRoute = (element, user, redirect) => {
    return (
      <PrivateRoute user={user} redirect={redirect}>
        {element}
      </PrivateRoute>
    );
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />  
      <Route path="/signup" element={<Signup />} />  

      <Route path="/client" element={wrapPrivateRoute(<Dashboard />, isLoggedIn, 'client')} />  
      <Route path="/client/car/:carId" element={wrapPrivateRoute(<SaleCar />, isLoggedIn, 'saleCar')} />  
      <Route path="/client/cabinet" element={wrapPrivateRoute(<Cabinet />, isLoggedIn, 'cabinet')} />  
      <Route path="/client/add_auto" element={wrapPrivateRoute(<AddAuto />, isLoggedIn, 'addAuto')} />  
      <Route path="/client/change_auto/:carId" element={wrapPrivateRoute(<ClientChangeAuto />, isLoggedIn, 'clientChangeAuto')} />  
      <Route path="/client/my_autos" element={wrapPrivateRoute(<MyCars />, isLoggedIn, 'myCars')} /> 

      {/* manager */}
      <Route path="/manager/users" element={wrapPrivateRoute(<ManagerDashboard />, isLoggedIn, 'ManageDashboard')} /> 
      <Route path="/manager/cars" element={wrapPrivateRoute(<Autos />, isLoggedIn, 'Auto')} />   
      <Route path="/manager/cars/:carId" element={wrapPrivateRoute(<ChangeAuto />, isLoggedIn, 'ChangeAuto')} />   
      <Route path="/manager/approve/cars" element={wrapPrivateRoute(<ApproveCarPage />, isLoggedIn, 'ApproveCarPage')} />  
      <Route path="/manager/cabinet" element={wrapPrivateRoute(<ManagerCabinet />, isLoggedIn, 'ManagerCabinet')} />  
      <Route path="/manager/add_auto" element={wrapPrivateRoute(<ManagerAddAuto />, isLoggedIn, 'ManagerAddAuto')} />  
      <Route path="/manager/my_autos" element={wrapPrivateRoute(<ManagerMyCars />, isLoggedIn, 'ManagerMyCars')} />  
      <Route path="/manager/change_auto/:carId" element={wrapPrivateRoute(<ManagerChangeAuto />, isLoggedIn, 'managerChangeAuto')} />  
      <Route path="/manager/view/cars" element={wrapPrivateRoute(<ManagerViewCars />, isLoggedIn, 'ManagerViewCars')} /> 
      <Route path="/manager/car/:carId" element={wrapPrivateRoute(<ManagerSaleCar />, isLoggedIn, 'ManagerSaleCar')} /> 

      {/* admin */}
      <Route path="/admin" element={wrapPrivateRoute(<AdminDashboard />)} />
      <Route path="/admin/approve/managers" element={wrapPrivateRoute(<ApproveManagersPage />, isLoggedIn, 'ApproveManagerPage')} />
      <Route path="/admin/update/managers/:managerId" element={wrapPrivateRoute(<UpdateManager />, isLoggedIn, 'UpdateRoute')} /> 
      <Route path="/admin/cabinet" element={wrapPrivateRoute(<AdminCabinet />, isLoggedIn, 'AdminCabinet')} />  

      {/* chat */}
      <Route path="/chat" element={wrapPrivateRoute(<Chat />)}/> 
      <Route path="/signout" element={wrapPrivateRoute(<SignOut />)} />
    </Routes>
  );
};

export default App;
