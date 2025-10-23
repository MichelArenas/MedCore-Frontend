/**
 * Servicio para realizar peticiones HTTP a los microservicios
 * a través del API Gateway
 */

/**
 * Realiza una petición al API Gateway con manejo de token de autenticación
 * 
 * @param {string} url - URL completa del endpoint
 * @param {Object} options - Opciones para fetch (method, headers, body)
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const apiRequest = async (url, options = {}) => {
  try {
    // Configuración por defecto para la petición
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Combinar opciones por defecto con las recibidas
    const requestOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    // Añadir token de autenticación si está disponible
    const token = localStorage.getItem('token');
    if (token) {
      requestOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    // Si el body es FormData, NO fijes 'Content-Type' (el navegador lo pone con boundary)
    if (requestOptions.body instanceof FormData) {
      delete requestOptions.headers['Content-Type'];
    }

    // Realizar la petición
    const response = await fetch(url, requestOptions);
    
    // Manejar respuesta 401 (Unauthorized) automáticamente para redirección al login
    if (response.status === 401) {
      // Si es un error de token inválido o expirado, limpiar localStorage
      if (!url.includes('/auth/sign-in')) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('fullname');
        window.location.href = '/login'; // Redireccionar al login
      }
    }

    // Procesar la respuesta
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.indexOf('application/json') !== -1) {
      const data = await response.json();
      return {
        status: response.status,
        ok: response.ok,
        data,
      };
    } else {
      const text = await response.text();
      return {
        status: response.status,
        ok: response.ok,
        data: text,
      };
    }
  } catch (error) {
    console.error('Error en la petición API:', error);
    return {
      status: 500,
      ok: false,
      error: error.message || 'Error de conexión con el servidor',
    };
  }
};

/**
 * Realiza una petición GET
 * 
 * @param {string} url - URL del endpoint
 * @param {Object} options - Opciones adicionales para la petición
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const get = async (url, options = {}) => {
  return apiRequest(url, { 
    ...options, 
    method: 'GET' 
  });
};

/**
 * Realiza una petición POST
 * 
 * @param {string} url - URL del endpoint
 * @param {Object} data - Datos a enviar en el body
 * @param {Object} options - Opciones adicionales para la petición
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const post = async (url, data, options = {}) => {
  return apiRequest(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Realiza una petición PUT
 * 
 * @param {string} url - URL del endpoint
 * @param {Object} data - Datos a enviar en el body
 * @param {Object} options - Opciones adicionales para la petición
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const put = async (url, data, options = {}) => {
  return apiRequest(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Realiza una petición PATCH
 * 
 * @param {string} url - URL del endpoint
 * @param {Object} data - Datos a enviar en el body
 * @param {Object} options - Opciones adicionales para la petición
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const patch = async (url, data, options = {}) => {
  return apiRequest(url, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

/**
 * Realiza una petición DELETE
 * 
 * @param {string} url - URL del endpoint
 * @param {Object} options - Opciones adicionales para la petición
 * @returns {Promise<Object>} - Respuesta de la API
 */
export const del = async (url, options = {}) => {
  return apiRequest(url, {
    ...options,
    method: 'DELETE',
  });
};