import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import RegisterUser from "./components/RegisterUser";
import DashboardAdmin from "./components/DashboardAdmin";
import DashboardMedico from "./components/DashboardMedico";
import DashboardPaciente from "./components/DashboardPaciente";
import DashboardEnfermero from "./components/DashboardEnfermero";
import VerifyEmail from "./components/VerifyEmail";
import PrivateRoute from "./components/PrivateRoute";
import BulkImportCsv from "./components/bulkTmportCsv";
import LandingPage from "./components/LandinPage";


function App() {
  return (
   
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/DashboardAdmin" element={<PrivateRoute><DashboardAdmin /></PrivateRoute>} />
        <Route path="/DashboardMedico" element={<PrivateRoute><DashboardMedico /></PrivateRoute>} />
        <Route path="/DashboardPaciente" element={<PrivateRoute><DashboardPaciente /></PrivateRoute>} />
        <Route path="/DashboardEnfermero" element={<PrivateRoute><DashboardEnfermero /></PrivateRoute>} />
        <Route path="/register-user" element={<PrivateRoute><RegisterUser /></PrivateRoute>} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/bulk-import" element={<BulkImportCsv />} />
      </Routes>
    </Router>
 
  );
}
export default App;
