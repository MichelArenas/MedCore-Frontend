/**
 * Servicio tipo Axios para todos los microservicios
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
    console.log("🔑 TOKEN ENVIADoo =", token);

    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }

    // Configuración fetch
    const fetchOptions = {
      method,
      headers: requestHeaders,
    };

    // Si hay body
    if (data !== null && method !== "GET" && method !== "DELETE") {
      fetchOptions.body = data instanceof FormData ? data : JSON.stringify(data);

      // Si es FormData, no obligamos el content-type
      if (data instanceof FormData) {
        delete requestHeaders["Content-Type"];
      }
    }

    console.log("🔍 Fetch request:", { finalUrl, fetchOptions });

    const response = await fetch(finalUrl, fetchOptions);

    const contentType = response.headers.get("content-type");

    let responseData;
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    console.log("🔍 Fetch response:", { status: response.status, ok: response.ok, data: responseData });

    return {
      status: response.status,
      ok: response.ok,
      data: responseData,
    };

  } catch (err) {
    console.error("Error apiRequest:", err);
    return { 
      ok: false, 
      status: 500, 
      data: null,
      error: err.message 
    };
  }
};

/**
 * Realiza una petición GET
 */
export const get = async (url, params = {}, options = {}) => {
  return apiRequest({ 
    url,
    method: 'GET',
    params,
    ...options 
  });
};

/**
 * Realiza una petición POST
 */
export const post = async (url, data = null, options = {}) => {
  return apiRequest({
    url,
    method: 'POST',
    data,
    ...options
  });
};

/**
 * Realiza una petición PUT
 */
export const put = async (url, data = null, options = {}) => {
  return apiRequest({
    url,
    method: 'PUT',
    data,
    ...options
  });
};

/**
 * Realiza una petición PATCH
 */
export const patch = async (url, data = null, options = {}) => {
  return apiRequest({
    url,
    method: 'PATCH',
    data,
    ...options
  });
};

/**
 * Realiza una petición DELETE
 */
export const del = async (url, options = {}) => {
  return apiRequest({
    url,
    method: 'DELETE',
    ...options
  });
};