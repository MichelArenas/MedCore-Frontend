import axios from 'axios';

const BASE_URL = process.env.REACT_APP_MEDICAL_RECORDS_URL || 'http://localhost:3005';

export const MedicalApi = {
  async health() {
    const res = await axios.get(`${BASE_URL}/health`);
    // tu backend responde algo como:
    // { ok: true, ts: '...', service: 'medical-records-service', port: 3005 }
    return res.data;
  },
};

/* Endpoints para historial médico
export const MEDICAL_RECORDS_ENDPOINTS = {
  BASE: `${API_GATEWAY_URL}/api/v1/medical-records`,
  // listar historias de un paciente
  BY_PATIENT: (patientId) => `${API_GATEWAY_URL}/api/v1/medical-records/by-patient/${patientId}`,
  // obtener una historia por su id (recordId)
  GET_BY_ID: (recordId) => `${API_GATEWAY_URL}/api/v1/medical-records/${recordId}`,
};


// Documents (adjuntos)
export const DOCUMENTS_ENDPOINTS = {
  UPLOAD: `${API_GATEWAY_URL}/api/v1/documents/upload`,                 // POST multipart
  BY_PATIENT: (id) => `${API_GATEWAY_URL}/api/v1/documents/patient/${id}`, // GET
  GET_BY_ID: (id) => `${API_GATEWAY_URL}/api/v1/documents/${id}`,          // GET (descarga)
  DELETE: (id) => `${API_GATEWAY_URL}/api/v1/documents/${id}`,             // DELETE
};*/