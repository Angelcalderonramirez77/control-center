// ========================================
// Módulo de Autenticación Compartido
// ========================================
// Funciones reutilizables para login, logout y validación de sesión

const API_URL = 'http://localhost:3000/api';

/**
 * Autentica a un usuario contra la API
 * @param {string} employeeId - Cédula del empleado
 * @param {string} password - Contraseña
 * @returns {Promise<Object|null>} Datos del usuario o null si falla
 */
export async function login(employeeId, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ employeeId, password })
        });

        if (!response.ok) {
            return null;
        }

        const user = await response.json();
        if (user && user.id) {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            return user;
        }
        return null;
    } catch (error) {
        console.error('Error en login:', error);
        return null;
    }
}

/**
 * Cierra la sesión del usuario actual
 */
export function logout() {
    sessionStorage.removeItem('currentUser');
}

/**
 * Obtiene el usuario actualmente autenticado
 * @returns {Object|null} Datos del usuario o null
 */
export function getCurrentUser() {
    const userJson = sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

/**
 * Verifica si hay un usuario autenticado
 * @returns {boolean} True si hay sesión activa
 */
export function isAuthenticated() {
    return getCurrentUser() !== null;
}

/**
 * Verifica si el usuario actual es administrador
 * @returns {boolean} True si es admin
 */
export function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

/**
 * Redirige al login si no hay sesión activa
 * @param {string} requiredRole - Rol requerido (opcional)
 */
export function requireAuth(requiredRole = null) {
    const user = getCurrentUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    
    if (requiredRole && user.role !== requiredRole) {
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

/**
 * Formatea cédula dominicana (XXX-XXXXXXX-X)
 * @param {string} cedula - Cédula sin formato
 * @returns {string} Cédula formateada
 */
export function formatCedula(cedula) {
    // Eliminar guiones existentes
    const clean = cedula.replace(/-/g, '');
    
    // Si tiene 11 dígitos, formatear
    if (clean.length === 11 && /^\d+$/.test(clean)) {
        return `${clean.substring(0, 3)}-${clean.substring(3, 10)}-${clean.substring(10)}`;
    }
    
    // Si ya tiene guiones y formato correcto, devolver tal cual
    if (cedula.length === 13 && cedula.includes('-')) {
        return cedula;
    }
    
    return cedula;
}

/**
 * Valida formato de cédula dominicana
 * @param {string} cedula - Cédula a validar
 * @returns {boolean} True si es válida
 */
export function isValidCedula(cedula) {
    const clean = cedula.replace(/-/g, '');
    return clean.length === 11 && /^\d+$/.test(clean);
}

/**
 * Muestra mensaje de error en un elemento
 * @param {HTMLElement} element - Elemento donde mostrar el error
 * @param {string} message - Mensaje de error
 */
export function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.classList.add('show');
        element.classList.remove('hidden');
    }
}

/**
 * Oculta mensaje de error
 * @param {HTMLElement} element - Elemento del error
 */
export function hideError(element) {
    if (element) {
        element.textContent = '';
        element.classList.remove('show');
        element.classList.add('hidden');
    }
}
