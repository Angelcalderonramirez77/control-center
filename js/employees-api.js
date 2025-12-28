/**
 * FUNCIONES MEJORADAS PARA EL DISEÑO
 * Incluye todas las funcionalidades de empleados con ingresos y detalles
 */

const API_URL = 'http://localhost:3000/api';

// ========================================
// EMPLEADOS - FUNCIONES COMPLETAS
// ========================================

/**
 * Obtener todos los empleados con información completa
 */
export async function getAllEmployees() {
    try {
        const response = await fetch(`${API_URL}/employees`);
        const employees = await response.json();
        return employees;
    } catch (error) {
        console.error('Error al obtener empleados:', error);
        return [];
    }
}

/**
 * Obtener detalles completos de un empleado (con ingresos totales)
 */
export async function getEmployeeDetails(employeeId) {
    try {
        const response = await fetch(`${API_URL}/employees/${employeeId}/details`);
        if (!response.ok) throw new Error('Empleado no encontrado');
        const details = await response.json();
        return details;
    } catch (error) {
        console.error('Error al obtener detalles del empleado:', error);
        return null;
    }
}

/**
 * Obtener ingresos diarios de un empleado
 */
export async function getEmployeeIncome(employeeId) {
    try {
        const response = await fetch(`${API_URL}/employees/${employeeId}/income`);
        const income = await response.json();
        return income;
    } catch (error) {
        console.error('Error al obtener ingresos:', error);
        return [];
    }
}

/**
 * Crear un nuevo empleado con todos los datos
 */
export async function createEmployee(employeeData) {
    try {
        const response = await fetch(`${API_URL}/employees`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: employeeData.id,
                name: employeeData.name,
                password: employeeData.password,
                role: employeeData.role || 'employee',
                salary: employeeData.salary,
                start_date: employeeData.start_date,
                position: employeeData.position,
                daily_wage: employeeData.daily_wage,
                hours_per_day: employeeData.hours_per_day || 8
            })
        });
        if (!response.ok) throw new Error('Error al crear empleado');
        const newEmployee = await response.json();
        return newEmployee;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

/**
 * Actualizar un empleado
 */
export async function updateEmployee(employeeId, updateData) {
    try {
        const response = await fetch(`${API_URL}/employees/${employeeId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: updateData.name,
                role: updateData.role,
                salary: updateData.salary,
                position: updateData.position,
                daily_wage: updateData.daily_wage,
                hours_per_day: updateData.hours_per_day,
                start_date: updateData.start_date,
                password: updateData.password
            })
        });
        if (!response.ok) throw new Error('Error al actualizar');
        const updated = await response.json();
        return updated;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

/**
 * Eliminar un empleado
 */
export async function deleteEmployee(employeeId) {
    try {
        const response = await fetch(`${API_URL}/employees/${employeeId}`, {
            method: 'DELETE'
        });
        return response.ok || response.status === 204;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================

/**
 * Calcular días trabajados desde la fecha de inicio
 */
export function calculateDaysWorked(startDate) {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Calcular sueldo diario en base al salario mensual
 */
export function calculateDailyWage(monthlySalary) {
    return (monthlySalary / 22).toFixed(2);
}

/**
 * Generar datos para gráfico de ingresos
 */
export function generateIncomeChartData(incomeData) {
    const labels = incomeData.map(d => new Date(d.income_date).toLocaleDateString());
    const data = incomeData.map(d => d.amount);
    
    return {
        labels: labels,
        datasets: [{
            label: 'Ingreso Diario',
            data: data,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4,
            fill: true
        }]
    };
}

/**
 * Formatear dinero en formato de moneda
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('es-DO', {
        style: 'currency',
        currency: 'DOP'
    }).format(amount);
}

/**
 * Formatear fecha
 */
export function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
