/**
 * Configuración centralizada para conexión a los microservicios
 * a través del API Gateway
 */

// Base del API (lee REACT_APP_API_BASE_URL o por defecto '')
const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

// Exporta la base por si otros módulos la necesitan
export const API_GATEWAY_URL = API_BASE;

// el resto de endpoints tal cual:
export const AUTH_ENDPOINTS = {
  SIGN_IN: `${API_GATEWAY_URL}/api/v1/auth/sign-in`,
  SIGN_UP: `${API_GATEWAY_URL}/api/v1/auth/sign-up`,
  VERIFY_EMAIL: `${API_GATEWAY_URL}/api/v1/auth/verify-email`,
};

// Endpoints para gestión de usuarios
export const USER_ENDPOINTS = {
  BASE: `${API_GATEWAY_URL}/api/v1/users`,
  GET_BY_ID: (id) => `${API_GATEWAY_URL}/api/v1/users/${id}`,
  ACTIVATE: (id) => `${API_GATEWAY_URL}/api/v1/users/${id}/activate`,
  DEACTIVATE: (id) => `${API_GATEWAY_URL}/api/v1/users/${id}/deactivate`,
  UPDATE_PASSWORD: (id) => `${API_GATEWAY_URL}/api/v1/users/${id}/password`,
};

// Endpoints para gestión de departamentos
export const DEPT_ENDPOINTS = {
  BASE: `${API_GATEWAY_URL}/api/v1/departments`,
  GET_BY_ID: (id) => `${API_GATEWAY_URL}/api/v1/departments/${id}`,
};

// Endpoints para gestión de afiliaciones
export const AFFILIATION_ENDPOINTS = {
  BASE: `${API_GATEWAY_URL}/api/v1/affiliations`,
  GET_BY_ID: (id) => `${API_GATEWAY_URL}/api/v1/affiliations/${id}`,
};

// Endpoints para gestión de especialidades
export const SPECIALITY_ENDPOINTS = {
  BASE: `${API_GATEWAY_URL}/api/v1/specialities`,
  GET_BY_ID: (id) => `${API_GATEWAY_URL}/api/v1/specialities/${id}`,
};

// Endpoints para gestión de pacientes
export const PATIENT_ENDPOINTS = {
  BASE: `${API_GATEWAY_URL}/api/v1/patients`,
  GET_BY_ID: (id) => `${API_GATEWAY_URL}/api/v1/patients/${id}`,
  GET_MEDICAL_HISTORY: (id) => `${API_GATEWAY_URL}/api/v1/patients/${id}/medical-history`,
};

// Endpoints para historial médico
export const MEDICAL_RECORDS_ENDPOINTS = {
  BASE: `${API_GATEWAY_URL}/api/v1/medical-records`,
  GET_BY_ID: (id) => `${API_GATEWAY_URL}/api/v1/medical-records/${id}`,
};

// Endpoints para auditoría
export const AUDIT_ENDPOINTS = {
  BASE: `${API_GATEWAY_URL}/api/v1/audit`,
  GET_BY_ENTITY: (entity, id) => `${API_GATEWAY_URL}/api/v1/audit/${entity}/${id}`,
};