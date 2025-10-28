import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./components/Login";
import RegisterUser from "./components/RegisterUser";
import DashboardAdmin from "./components/DashboardAdmin";
import DashboardMedico from "./components/DashboardMedico";
import DashboardPaciente from "./components/DashboardPaciente";
import DashboardEnfermero from "./components/DashboardEnfermero";
import VerifyEmail from "./components/VerifyEmail";
import BulkImportCsv from "./components/bulkTmportCsv";
import LandingPage from "./components/LandinPage";
import DashboardDoctorsList from "./components/DashboardDoctorsList";
import DashboardNursesList from "./components/DashboardNursesList";
import DashboardPatientsList from "./components/DashboardPatientsList";
import MedicalHistoryView from "./components/medical/MedicalHistoryView";
import MedicalHistoryNew from "./components/medical/MedicalHistoryNew";
import MedicalHistoryEdit from "./components/medical/MedicalHistoryEdit";
import PatientDocumentsImproved from "./components/medical/PatientDocumentsImproved";
import { canReadHistory, canWriteHistory } from "./utils/rbac";

function App() {
  return (
   
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/DashboardAdmin" element={<PrivateRoute><DashboardAdmin /></PrivateRoute>} />
        <Route path="/DashboardMedico" element={<PrivateRoute><DashboardMedico /></PrivateRoute>} />
        <Route path="/DashboardPatientsList" element={<PrivateRoute><DashboardPatientsList/></PrivateRoute>}/>
        <Route path="/DashboardDoctorsList" element={<PrivateRoute><DashboardDoctorsList/></PrivateRoute>}/>
        <Route path="/DashboardNursesList" element={<PrivateRoute><DashboardNursesList/></PrivateRoute>}/>
        <Route path="/DashboardPaciente" element={<PrivateRoute><DashboardPaciente /></PrivateRoute>} />
        <Route path="/DashboardEnfermero" element={<PrivateRoute><DashboardEnfermero /></PrivateRoute>} />
        <Route path="/register-user" element={<PrivateRoute><RegisterUser /></PrivateRoute>} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/bulk-import" element={<BulkImportCsv />} />
        <Route path="/dashboard/medical-history/:patientId" element={ <PrivateRoute allow={(user, params) => canReadHistory(user, params.patientId)}><MedicalHistoryView /></PrivateRoute>}/>
        <Route path="/dashboard/medical-history/new"element={<PrivateRoute allow={(user) => canWriteHistory(user)}><MedicalHistoryNew /></PrivateRoute>}/>
        <Route path="/dashboard/medical-history/:id/edit" element={<PrivateRoute allow={(user) => canWriteHistory(user)}><MedicalHistoryEdit /></PrivateRoute>}/>
        <Route path="/dashboard/documents/:patientId" element={<PrivateRoute allow={(user, params) => canReadHistory(user, params.patientId)}><PatientDocumentsImproved /></PrivateRoute>}/>
        <Route path="/dashboard/pacientes" element={<PrivateRoute allow={(u) => ["MEDICO","ADMINISTRADOR"].includes(u?.role)}><DashboardPatientsList /></PrivateRoute>}/>
      </Routes>
</Router>
 
  );
}
export default App;
