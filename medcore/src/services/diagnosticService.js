// src/services/diagnosticService.js
import apiService from './apiService';

const diagnosticService = {
  // Obtener diagnósticos de un paciente
  getPatientDiagnostics: async (patientId) => {
    return await apiService.get(`/api/v1/diagnostics/patient/${patientId}`);
  },

  // Obtener diagnósticos de una historia clínica específica
  getDiagnosticsByMedicalRecord: async (medicalRecordId) => {
    return await apiService.get(`/api/v1/diagnostics/medical-record/${medicalRecordId}`);
  },

  // Crear nuevo diagnóstico
  createDiagnostic: async (diagnosticData) => {
    return await apiService.post('/api/v1/diagnostics', diagnosticData);
  },

  // Obtener un diagnóstico específico
  getDiagnostic: async (diagnosticId) => {
    return await apiService.get(`/api/v1/diagnostics/${diagnosticId}`);
  },

  // Actualizar diagnóstico
  updateDiagnostic: async (diagnosticId, diagnosticData) => {
    return await apiService.put(`/api/v1/diagnostics/${diagnosticId}`, diagnosticData);
  },

  // Obtener documentos de un diagnóstico
  getDiagnosticDocuments: async (diagnosticId) => {
    return await apiService.get(`/api/v1/diagnostics/${diagnosticId}/documents`);
  }
};

export default diagnosticService;