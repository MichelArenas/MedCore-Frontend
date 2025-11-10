// src/services/medicalRecordService.js
import { get, post, put } from '../utils/apiService';
import { MEDICAL_RECORDS_ENDPOINTS } from '../utils/apiConfig';

// helper para unwrap
const unwrap = (res) => (res && typeof res === 'object' && 'data' in res ? res.data : res);

// Siempre usar los endpoints centralizados de apiConfig
const medicalRecordService = {
  // Listar historias clínicas de un paciente
  getPatientMedicalRecords: async (patientId) => {
    const res = await get(MEDICAL_RECORDS_ENDPOINTS.BY_PATIENT(patientId));
    return unwrap(res);
  },

  // Crear nueva historia clínica
  createMedicalRecord: (payload) =>
    post(MEDICAL_RECORDS_ENDPOINTS.BASE, payload),

  // Obtener una historia clínica por ID de historia (recordId)
  getMedicalRecord: (recordId) =>
    get(MEDICAL_RECORDS_ENDPOINTS.GET_BY_ID(recordId)),

  // Actualizar historia clínica por ID de historia (recordId)
  updateMedicalRecord: (recordId, payload) =>
    put(MEDICAL_RECORDS_ENDPOINTS.GET_BY_ID(recordId), payload),

  // (opcional) Diagnósticos por ID de historia si existe ese endpoint
  getMedicalRecordDiagnostics: (recordId) =>
    get(`${MEDICAL_RECORDS_ENDPOINTS.GET_BY_ID(recordId)}/diagnostics`),
};

export default medicalRecordService;
