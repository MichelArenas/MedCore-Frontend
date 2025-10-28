// src/services/medicalRecordService.js
import apiService from './apiService';

const medicalRecordService = {
  // Obtener historias clínicas de un paciente
  getPatientMedicalRecords: async (patientId) => {
    return await apiService.get(`/api/v1/medical-records/patient/${patientId}`);
  },

  // Crear nueva historia clínica
  createMedicalRecord: async (medicalRecordData) => {
    return await apiService.post('/api/v1/medical-records', medicalRecordData);
  },

  // Obtener una historia clínica específica
  getMedicalRecord: async (recordId) => {
    return await apiService.get(`/api/v1/medical-records/${recordId}`);
  },

  // Actualizar historia clínica
  updateMedicalRecord: async (recordId, medicalRecordData) => {
    return await apiService.put(`/api/v1/medical-records/${recordId}`, medicalRecordData);
  },

  // Obtener diagnósticos de una historia clínica
  getMedicalRecordDiagnostics: async (recordId) => {
    return await apiService.get(`/api/v1/medical-records/${recordId}/diagnostics`);
  }
};

export default medicalRecordService;