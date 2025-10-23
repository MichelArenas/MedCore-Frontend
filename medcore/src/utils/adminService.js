/**
 * Servicios para los paneles de administración
 */

import { get, post, put, patch, del } from './apiService';
import { 
  DEPT_ENDPOINTS, 
  AFFILIATION_ENDPOINTS, 
  SPECIALITY_ENDPOINTS,
  PATIENT_ENDPOINTS,
  MEDICAL_RECORDS_ENDPOINTS,
  AUDIT_ENDPOINTS
} from './apiConfig';

/**
 * Servicio para gestión de departamentos
 */
export const departmentService = {
  /**
   * Obtener todos los departamentos
   * 
   * @returns {Promise<Object>} - Lista de departamentos
   */
  getAllDepartments: async () => {
    return await get(DEPT_ENDPOINTS.BASE);
  },

  /**
   * Obtener un departamento por ID
   * 
   * @param {string} id - ID del departamento
   * @returns {Promise<Object>} - Datos del departamento
   */
  getDepartmentById: async (id) => {
    return await get(DEPT_ENDPOINTS.GET_BY_ID(id));
  },

  /**
   * Crear un nuevo departamento
   * 
   * @param {Object} deptData - Datos del departamento a crear
   * @returns {Promise<Object>} - Departamento creado
   */
  createDepartment: async (deptData) => {
    return await post(DEPT_ENDPOINTS.BASE, deptData);
  },

  /**
   * Actualizar un departamento
   * 
   * @param {string} id - ID del departamento
   * @param {Object} deptData - Datos actualizados del departamento
   * @returns {Promise<Object>} - Departamento actualizado
   */
  updateDepartment: async (id, deptData) => {
    return await put(DEPT_ENDPOINTS.GET_BY_ID(id), deptData);
  },

  /**
   * Eliminar un departamento
   * 
   * @param {string} id - ID del departamento a eliminar
   * @returns {Promise<Object>} - Respuesta de la eliminación
   */
  deleteDepartment: async (id) => {
    return await del(DEPT_ENDPOINTS.GET_BY_ID(id));
  },
};

/**
 * Servicio para gestión de afiliaciones
 */
export const affiliationService = {
  /**
   * Obtener todas las afiliaciones
   * 
   * @returns {Promise<Object>} - Lista de afiliaciones
   */
  getAllAffiliations: async () => {
    return await get(AFFILIATION_ENDPOINTS.BASE);
  },

  /**
   * Obtener una afiliación por ID
   * 
   * @param {string} id - ID de la afiliación
   * @returns {Promise<Object>} - Datos de la afiliación
   */
  getAffiliationById: async (id) => {
    return await get(AFFILIATION_ENDPOINTS.GET_BY_ID(id));
  },

  /**
   * Crear una nueva afiliación
   * 
   * @param {Object} affData - Datos de la afiliación a crear
   * @returns {Promise<Object>} - Afiliación creada
   */
  createAffiliation: async (affData) => {
    return await post(AFFILIATION_ENDPOINTS.BASE, affData);
  },
};

/**
 * Servicio para gestión de especialidades
 */
export const specialityService = {
  /**
   * Obtener todas las especialidades
   * 
   * @returns {Promise<Object>} - Lista de especialidades
   */
  getAllSpecialities: async () => {
    return await get(SPECIALITY_ENDPOINTS.BASE);
  },

  /**
   * Obtener una especialidad por ID
   * 
   * @param {string} id - ID de la especialidad
   * @returns {Promise<Object>} - Datos de la especialidad
   */
  getSpecialityById: async (id) => {
    return await get(SPECIALITY_ENDPOINTS.GET_BY_ID(id));
  },

  /**
   * Crear una nueva especialidad
   * 
   * @param {Object} specData - Datos de la especialidad a crear
   * @returns {Promise<Object>} - Especialidad creada
   */
  createSpeciality: async (specData) => {
    return await post(SPECIALITY_ENDPOINTS.BASE, specData);
  },
};

/**
 * Servicio para gestión de pacientes
 */
export const patientService = {
  /**
   * Obtener todos los pacientes
   * 
   * @returns {Promise<Object>} - Lista de pacientes
   */
  getAllPatients: async () => {
    return await get(PATIENT_ENDPOINTS.BASE);
  },

  /**
   * Obtener un paciente por ID
   * 
   * @param {string} id - ID del paciente
   * @returns {Promise<Object>} - Datos del paciente
   */
  getPatientById: async (id) => {
    return await get(PATIENT_ENDPOINTS.GET_BY_ID(id));
  },

  /**
   * Obtener historial médico de un paciente
   * 
   * @param {string} id - ID del paciente
   * @returns {Promise<Object>} - Historial médico del paciente
   */
  getPatientMedicalHistory: async (id) => {
    return await get(PATIENT_ENDPOINTS.GET_MEDICAL_HISTORY(id));
  },
};

/**
 * Servicio para gestión de auditoría
 */
export const auditService = {
  /**
   * Obtener registros de auditoría
   * 
   * @returns {Promise<Object>} - Lista de registros de auditoría
   */
  getAllAuditRecords: async () => {
    return await get(AUDIT_ENDPOINTS.BASE);
  },

  /**
   * Obtener registros de auditoría por entidad
   * 
   * @param {string} entity - Tipo de entidad (User, Patient, etc.)
   * @param {string} id - ID de la entidad
   * @returns {Promise<Object>} - Lista de registros de auditoría para la entidad
   */
  getAuditRecordsByEntity: async (entity, id) => {
    return await get(AUDIT_ENDPOINTS.GET_BY_ENTITY(entity, id));
  },
};