import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import RegisterUser from "./components/RegisterUser";
import DashboardAdmin from "./components/DashboardAdmin";
import DashboardMedico from "./components/DashboardMedico";
import DashboardPaciente from "./components/DashboardPaciente";
import DashboardEnfermero from "./components/DashboardEnfermero";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/DashboardAdmin" element={<DashboardAdmin />} />
        <Route path="/DashboardMedico" element={<DashboardMedico />} />
        <Route path="/DashboardPaciente" element={<DashboardPaciente />} />
        <Route path="/DashboardEnfermero" element={<DashboardEnfermero />} />
        <Route path="/register-user" element={<RegisterUser />} />
      </Routes>
    </Router>
  );
}

export default App;
