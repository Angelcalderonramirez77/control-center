// ========================================
// Módulo de API Compartido
// ========================================
// Funciones centralizadas para llamadas a la API

const API_URL = 'http://localhost:3000/api';

/**
 * Realiza una petición GET a la API
 * @param {string} endpoint - Endpoint de la API
 * @returns {Promise<any>} Respuesta de la API
 */
export async function apiGet(endpoint) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error en GET ${endpoint}:`, error);
        throw error;
    }
}

/**
 * Realiza una petición POST a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} data - Datos a enviar
 * @returns {Promise<any>} Respuesta de la API
 */
export async function apiPost(endpoint, data) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error en POST ${endpoint}:`, error);
        throw error;
    }
}

/**
 * Realiza una petición PUT a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} data - Datos a actualizar
 * @returns {Promise<any>} Respuesta de la API
 */
export async function apiPut(endpoint, data) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error en PUT ${endpoint}:`, error);
        throw error;
    }
}

/**
 * Realiza una petición DELETE a la API
 * @param {string} endpoint - Endpoint de la API
 * @returns {Promise<any>} Respuesta de la API
 */
export async function apiDelete(endpoint) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error en DELETE ${endpoint}:`, error);
        throw error;
    }
}

// ========================================
// Funciones específicas de Empleados
// ========================================

/**
 * Obtiene todos los empleados
 * @returns {Promise<Array>} Lista de empleados
 */
export async function getAllEmployees() {
    return await apiGet('/employees');
}

/**
 * Obtiene detalles de un empleado específico
 * @param {string} employeeId - ID del empleado
 * @returns {Promise<Object>} Datos del empleado
 */
export async function getEmployeeDetails(employeeId) {
    return await apiGet(`/employees/${employeeId}`);
}

/**
 * Obtiene los ingresos de un empleado
 * @param {string} employeeId - ID del empleado
 * @returns {Promise<Object>} Datos de ingresos
 */
export async function getEmployeeIncome(employeeId) {
    return await apiGet(`/payroll/employee/${employeeId}`);
}

/**
 * Crea un nuevo empleado
 * @param {Object} employeeData - Datos del empleado
 * @returns {Promise<Object>} Empleado creado
 */
export async function createEmployee(employeeData) {
    return await apiPost('/employees', employeeData);
}

/**
 * Actualiza un empleado existente
 * @param {string} employeeId - ID del empleado
 * @param {Object} employeeData - Datos a actualizar
 * @returns {Promise<Object>} Empleado actualizado
 */
export async function updateEmployee(employeeId, employeeData) {
    return await apiPut(`/employees/${employeeId}`, employeeData);
}

/**
 * Elimina un empleado
 * @param {string} employeeId - ID del empleado
 * @returns {Promise<Object>} Resultado de la eliminación
 */
export async function deleteEmployee(employeeId) {
    return await apiDelete(`/employees/${employeeId}`);
}

// ========================================
// Funciones de Charts/Gráficos
// ========================================

/**
 * Obtiene datos para gráficos
 * @param {string} employeeId - ID del empleado (opcional)
 * @returns {Promise<Object>} Datos de gráficos
 */
export async function getChartData(employeeId = null) {
    const endpoint = employeeId 
        ? `/charts/employee/${employeeId}` 
        : '/charts';
    return await apiGet(endpoint);
}

/**
 * Obtiene distribución de salarios
 * @returns {Promise<Array>} Distribución de salarios
 */
export async function getSalaryDistribution() {
    return await apiGet('/charts/salary-distribution');
}

/**
 * Obtiene ganancias mensuales
 * @returns {Promise<Array>} Ganancias por mes
 */
export async function getMonthlyProfits() {
    return await apiGet('/charts/monthly-profits');
}

// ========================================
// Funciones de Reportes
// ========================================

/**
 * Obtiene reportes de nómina
 * @param {Object} filters - Filtros de reporte
 * @returns {Promise<Object>} Datos del reporte
 */
export async function getPayrollReport(filters = {}) {
    const queryString = new URLSearchParams(filters).toString();
    const endpoint = queryString ? `/reports?${queryString}` : '/reports';
    return await apiGet(endpoint);
}
