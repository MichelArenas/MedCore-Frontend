/**
 * Servicios específicos para autenticación y gestión de usuarios
 */

import { post, get, put, patch, del } from './apiService';
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from './apiConfig';

/**
 * Servicio de autenticación
 */
export const authService = {
  /**
   * Iniciar sesión
   * 
   * @param {Object} credentials - Credenciales del usuario (email, password, verificationCode?)
   * @returns {Promise<Object>} - Respuesta con token y datos del usuario
   */
  login: async (credentials) => {
    return await post(AUTH_ENDPOINTS.SIGN_IN, credentials);
  },

  /**
   * Registrar un nuevo usuario
   * 
   * @param {Object} userData - Datos del usuario a registrar
   * @returns {Promise<Object>} - Respuesta con el usuario registrado
   */
  register: async (userData) => {
    return await post(AUTH_ENDPOINTS.SIGN_UP, userData);
  },

  /**
   * Verificar correo electrónico
   * 
   * @param {Object} verificationData - Datos de verificación (email, verificationCode)
   * @returns {Promise<Object>} - Respuesta de la verificación
   */
  verifyEmail: async (verificationData) => {
    return await post(AUTH_ENDPOINTS.VERIFY_EMAIL, verificationData);
  },
};

/**
 * Servicio de gestión de usuarios
 */
export const userService = {
  /**
   * Obtener todos los usuarios
   * 
   * @returns {Promise<Object>} - Lista de usuarios
   */
  getAllUsers: async () => {
    return await get(USER_ENDPOINTS.BASE);
  },

  /**
   * Obtener un usuario por ID
   * 
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>} - Datos del usuario
   */
  getUserById: async (id) => {
    return await get(USER_ENDPOINTS.GET_BY_ID(id));
  },

  /**
   * Crear un nuevo usuario (cuando el administrador lo crea)
   * 
   * @param {Object} userData - Datos del usuario a crear
   * @returns {Promise<Object>} - Usuario creado
   */
  createUser: async (userData) => {
    return await post(USER_ENDPOINTS.BASE, userData);
  },

  /**
   * Activar un usuario
   * 
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>} - Respuesta de la activación
   */
  activateUser: async (id) => {
    return await patch(USER_ENDPOINTS.ACTIVATE(id), {});
  },

  /**
   * Desactivar un usuario
   * 
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>} - Respuesta de la desactivación
   */
  deactivateUser: async (id) => {
    return await patch(USER_ENDPOINTS.DEACTIVATE(id), {});
  },

  /**
   * Actualizar contraseña
   * 
   * @param {string} id - ID del usuario
   * @param {Object} passwordData - Datos de contraseña (oldPassword, newPassword)
   * @returns {Promise<Object>} - Respuesta del cambio
   */
  updatePassword: async (id, passwordData) => {
    return await put(USER_ENDPOINTS.UPDATE_PASSWORD(id), passwordData);
  },
};