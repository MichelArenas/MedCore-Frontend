/**
 * Funciones de utilidad para manejo de autenticación
 */

/**
 * Cierra la sesión del usuario eliminando todos los datos del localStorage
 * @returns {void}
 */
export const logout = () => {
  // Eliminar items específicos que sabemos que existen
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("fullname");
  localStorage.removeItem("blockedUntil");
  localStorage.removeItem("userId");
  
  // Para mayor seguridad, limpiar TODO el localStorage relacionado con la aplicación
  // Esto asegura que cualquier dato agregado en el futuro también se elimine
  const keysToKeep = []; // Si hay claves que NO deben eliminarse, agrégalas aquí
  
  Object.keys(localStorage).forEach(key => {
    // Si no está en la lista de claves a conservar, eliminarla
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
    }
  });
  
  // Alternativa más radical: localStorage.clear();
  // Sin embargo, esto eliminaría TODOS los datos de localStorage de todos los sitios/apps
  // localStorage.clear();
};

/**
 * Verifica si el usuario está autenticado
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/**
 * Obtiene el rol del usuario actual
 * @returns {string|null}
 */
export const getUserRole = () => {
  return localStorage.getItem("role");
};

/**
 * Obtiene el nombre completo del usuario actual
 * @returns {string|null}
 */
export const getUserFullname = () => {
  return localStorage.getItem("fullname");
};