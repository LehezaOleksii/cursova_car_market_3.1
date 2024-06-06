import React from "react";
import { Routes, Route } from "react-router-dom"; 
import Dashboard from "./components/pages/client/Dashboard";
import SignIn from "./components/pages/Signin";
import ClientSignup from "./components/pages/client/ClientSignup";
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

const App = () => {
  return (
    <Routes>
      <Route path="/client/:id" element={<Dashboard />} />  
      <Route path="/signin" element={<SignIn />} />  
      <Route path="/signup" element={<ClientSignup />} />  
      <Route path="/client/:id/car/:carId" element={<SaleCar />} />  
      <Route path="/client/:id/cabinet" element={<Cabinet />} />  
      <Route path="/client/:id/add_auto" element={<AddAuto />} />  
      <Route path="/client/:id/change_auto/:carId" element={<ClientChangeAuto />} />  
      <Route path="/client/:id/my_autos" element={<MyCars />} /> 

      {/* manager */}
      <Route path="/manager/:id/users" element={<ManagerDashboard />} /> 
      <Route path="/manager/:id/cars" element={<Autos />} />   
      <Route path="/manager/:id/cars/:carId" element={<ChangeAuto />} />   
      <Route path="/manager/:id/approve/cars" element={<ApproveCarPage />} />  
      <Route path="/manager/:id/cabinet" element={<ManagerCabinet />} />  
      <Route path="/manager/:id/add_auto" element={<ManagerAddAuto />} />  
      <Route path="/manager/:id/my_autos" element={<ManagerMyCars />} />  
      <Route path="/manager/:id/change_auto/:carId" element={<ManagerChangeAuto />} />  
      <Route path="/manager/:id/view/cars" element={<ManagerViewCars />} /> 
      <Route path="/manager/:id/car/:carId" element={<ManagerSaleCar />} /> 



      {/* admin */}
      <Route path="/admin/:id" element={<AdminDashboard />} />
      <Route path="/admin/:id/approve/managers" element={<ApproveManagersPage />} />
      <Route path="/admin/:id/update/managers/:managerId" element={<UpdateManager />} /> 
      <Route path="/admin/:id/cabinet" element={<AdminCabinet />} />   
    </Routes>
  );
};

export default App;
