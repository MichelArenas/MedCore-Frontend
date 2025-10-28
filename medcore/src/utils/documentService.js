/**
 * Servicio para gestión de documentos médicos
 */

import { get, post, del, apiRequest } from './apiService';
import { DOCUMENTS_ENDPOINTS } from './apiConfig';

/**
 * Servicio de documentos médicos
 */
export const documentService = {
  /**
   * Obtener todos los documentos de un paciente
   * 
   * @param {string} patientId - ID del paciente
   * @returns {Promise<Object>} - Lista de documentos del paciente
   */
  getPatientDocuments: async (patientId) => {
    return await get(DOCUMENTS_ENDPOINTS.BY_PATIENT(patientId));
  },

  /**
   * Obtener un documento específico (para descarga o visualización)
   * 
   * @param {string} documentId - ID del documento
   * @returns {Promise<Object>} - Datos del documento o blob para descarga
   */
  getDocument: async (documentId) => {
    return await get(DOCUMENTS_ENDPOINTS.GET_BY_ID(documentId));
  },

  /**
   * Descargar un documento
   * 
   * @param {string} documentId - ID del documento
   * @param {string} filename - Nombre del archivo para la descarga
   */
  downloadDocument: async (documentId, filename) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(DOCUMENTS_ENDPOINTS.GET_BY_ID(documentId), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al descargar el documento');
      }

      // Crear blob y descargar
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return { success: true };
    } catch (error) {
      console.error('Error descargando documento:', error);
      throw error;
    }
  },

  /**
   * Eliminar un documento
   * 
   * @param {string} documentId - ID del documento
   * @returns {Promise<Object>} - Respuesta de la eliminación
   */
  deleteDocument: async (documentId) => {
    return await del(DOCUMENTS_ENDPOINTS.DELETE(documentId));
  },

  /**
   * Subir documento(s) para un paciente
   * 
   * @param {FormData} formData - FormData con archivo(s) y metadatos
   * @returns {Promise<Object>} - Respuesta de la subida
   */
  uploadDocument: async (formData) => {
    try {
      // Usar apiRequest directamente para FormData
      const result = await apiRequest(DOCUMENTS_ENDPOINTS.UPLOAD, {
        method: 'POST',
        body: formData, // FormData directo, sin JSON.stringify
      });
      
      return result;
    } catch (error) {
      console.error('Error subiendo documento:', error);
      return {
        status: 500,
        ok: false,
        error: error.message || 'Error de conexión con el servidor',
      };
    }
  },

  /**
   * Obtener URL para visualizar un documento en el navegador
   * 
   * @param {string} documentId - ID del documento
   * @returns {string} - URL para visualizar el documento
   */
  getDocumentViewUrl: (documentId) => {
    const token = localStorage.getItem('token');
    return `${DOCUMENTS_ENDPOINTS.GET_BY_ID(documentId)}?view=true&token=${token}`;
  }
};