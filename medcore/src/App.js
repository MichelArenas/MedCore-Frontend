import React from "react";

//Rutas y componentes
import './App.css';
import { HealthCheck } from './presentation/components/MedicalHealt' //Ruta de prueba para arquitectura limpia + ms-medical-records

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
import PerfilPaciente from "./components/PerfilPaciente";
import MisCitas from "./components/CitasList";
//import PerfilPaciente from "./components/PerfilPaciente"; 
import DoctorQueue from "./components/queue/DoctorQueueList";
//import TicketComplete from "./components/queue/TicketComplete";
import { canReadHistory, canWriteHistory } from "./utils/rbac";
import SolicitarCita from "./components/SolicitarCita";
import SalaDeEspera from "./components/SalaEspera";
import DoctorAppointments from "./components/CitasDoctor"
import PrescriptionForm from "./presentation/pages/prescription.jsx"
import PatientPrescriptions from "./components/PatientPrescriptions";
import DoctorConsultationView from "./presentation/pages/infoconsulta.jsx"

function App() {
  return (
    
    <Router>
      <Routes>
        {/*Ruta de prueba para arquitectura limpia + ms-medical-records */}
        <Route path="/health-test" element={<HealthCheck />} />

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
        <Route path="/dashboard/infoconsulta/:id" element={<DoctorConsultationView />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/ver-citas" element={<MisCitas />} />
        <Route path="/turno-virtual" element={<SalaDeEspera />} />
        <Route path="/solicitar-cita" element={<PrivateRoute><SolicitarCita /></PrivateRoute>} />
        <Route path="/bulk-import" element={<BulkImportCsv />} />
        <Route path="/citas-doctor" element={<DoctorAppointments />} />
        <Route path="/dashboard/prescription/:patientId/:medicalRecordId/new" element={<PrescriptionForm />}/>
        <Route path="/dashboard/prescriptions/:patientId" element={<PatientPrescriptions />} />
        <Route path="/dashboard/profile" element={<PrivateRoute><PerfilPaciente/></PrivateRoute>} />
        <Route path="/dashboard/medical-history/:patientId" element={ <PrivateRoute allow={(user, params) => canReadHistory(user, params.patientId)}><MedicalHistoryView /></PrivateRoute>}/>
        <Route path="/dashboard/medical-history/new"element={<PrivateRoute allow={(user) => canWriteHistory(user)}><MedicalHistoryNew /></PrivateRoute>}/>
        <Route path="/dashboard/medical-history/:id/edit" element={<PrivateRoute allow={(user) => canWriteHistory(user)}><MedicalHistoryEdit /></PrivateRoute>}/>
        <Route path="/dashboard/documents/:patientId" element={<PrivateRoute allow={(user, params) => canReadHistory(user, params.patientId)}><PatientDocumentsImproved /></PrivateRoute>}/>
        <Route path="/dashboard/pacientes" element={<PrivateRoute allow={(u) => ["MEDICO","ADMINISTRADOR"].includes(u?.role)}><DashboardPatientsList /></PrivateRoute>}/>
        <Route path="/doctor/:id/current" element={<DoctorQueue/>} />
       
      </Routes>
</Router>
 
  );
}
export default App;
