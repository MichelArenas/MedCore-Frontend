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
/**
 * Servicio tipo Axios para todos los microservicios
 * Acepta:
 *   apiRequest({ method, url, params, data, headers })
 */
export const apiRequest = async (config = {}) => {
  try {
    const {
      url,
      method = "GET",
      params = {},
      data = null,
      headers = {},
    } = config;

    if (!url) throw new Error("apiRequest requiere un 'url'");

    // Construir query params
    const queryString = new URLSearchParams(params).toString();
    const finalUrl = queryString ? `${url}?${queryString}` : url;

    // Headers por defecto
    const requestHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    // Token
    const token = localStorage.getItem("token");
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }

    // Configuración fetch
    const fetchOptions = {
      method,
      headers: requestHeaders,
    };

    // Si hay body
    if (data !== null) {
      fetchOptions.body = data instanceof FormData ? data : JSON.stringify(data);

      // Si es FormData, no obligamos el content-type
      if (data instanceof FormData) {
        delete fetchOptions.headers["Content-Type"];
      }
    }

    const response = await fetch(finalUrl, fetchOptions);

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      return {
        status: response.status,
        ok: response.ok,
        data: await response.json(),
      };
    }

    return {
      status: response.status,
      ok: response.ok,
      data: await response.text(),
    };

  } catch (err) {
    console.error("Error apiRequest:", err);
    return { ok: false, status: 500, error: err.message };
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