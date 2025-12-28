// ========================================
// Utilidades Compartidas
// ========================================
// Funciones de formateo, validación y ayuda general

/**
 * Formatea un número como moneda dominicana
 * @param {number} amount - Cantidad a formatear
 * @returns {string} Cantidad formateada (ej: RD$ 1,234.56)
 */
export function formatCurrency(amount) {
    if (amount === null || amount === undefined) return 'RD$ 0.00';
    return `RD$ ${parseFloat(amount).toLocaleString('es-DO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

/**
 * Formatea una fecha en formato legible
 * @param {string|Date} date - Fecha a formatear
 * @param {boolean} short - Si es true, formato corto (dd/mm/yyyy)
 * @returns {string} Fecha formateada
 */
export function formatDate(date, short = false) {
    if (!date) return 'N/A';
    
    const d = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(d.getTime())) return 'Fecha inválida';
    
    if (short) {
        return d.toLocaleDateString('es-DO');
    }
    
    return d.toLocaleDateString('es-DO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Calcula días trabajados desde una fecha de inicio
 * @param {string|Date} startDate - Fecha de inicio
 * @returns {number} Número de días trabajados
 */
export function calculateDaysWorked(startDate) {
    if (!startDate) return 0;
    
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const today = new Date();
    
    const diffTime = Math.abs(today - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

/**
 * Calcula el salario diario basado en el salario mensual
 * @param {number} monthlySalary - Salario mensual
 * @param {number} workingDays - Días laborables al mes (default: 22)
 * @returns {number} Salario diario
 */
export function calculateDailySalary(monthlySalary, workingDays = 22) {
    if (!monthlySalary || monthlySalary <= 0) return 0;
    return (monthlySalary / workingDays).toFixed(2);
}

/**
 * Genera un avatar basado en las iniciales del nombre
 * @param {string} name - Nombre completo
 * @returns {string} URL del avatar generado
 */
export function generateAvatar(name) {
    if (!name) return 'https://ui-avatars.com/api/?name=U&background=random';
    
    const initials = name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    
    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;
}

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 */
export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Valida una contraseña (mínimo 6 caracteres)
 * @param {string} password - Contraseña a validar
 * @returns {boolean} True si es válida
 */
export function isValidPassword(password) {
    return password && password.length >= 6;
}

/**
 * Valida un número de teléfono dominicano
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} True si es válido
 */
export function isValidPhone(phone) {
    // Formato: (809) 555-1234 o 809-555-1234 o 8095551234
    const clean = phone.replace(/[\s()-]/g, '');
    return /^(809|829|849)\d{7}$/.test(clean);
}

/**
 * Sanitiza input de usuario (previene XSS básico)
 * @param {string} input - Input del usuario
 * @returns {string} Input sanitizado
 */
export function sanitizeInput(input) {
    if (!input) return '';
    
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Debounce function para optimizar búsquedas
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función con debounce
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Muestra un toast/notificación temporal
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duración en ms (default: 3000)
 */
export function showToast(message, type = 'info', duration = 3000) {
    // Crear elemento toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196F3'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    // Eliminar después de la duración
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Confirma una acción del usuario
 * @param {string} message - Mensaje de confirmación
 * @returns {boolean} True si confirma
 */
export function confirmAction(message) {
    return confirm(message);
}

/**
 * Copia texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} True si se copió exitosamente
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Error al copiar:', error);
        return false;
    }
}

/**
 * Descarga datos como archivo JSON
 * @param {Object} data - Datos a descargar
 * @param {string} filename - Nombre del archivo
 */
export function downloadJSON(data, filename = 'data.json') {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Formatea un número de teléfono dominicano
 * @param {string} phone - Teléfono sin formato
 * @returns {string} Teléfono formateado (809) 555-1234
 */
export function formatPhone(phone) {
    const clean = phone.replace(/\D/g, '');
    if (clean.length === 10) {
        return `(${clean.substring(0, 3)}) ${clean.substring(3, 6)}-${clean.substring(6)}`;
    }
    return phone;
}

/**
 * Obtiene el nombre del mes en español
 * @param {number} monthIndex - Índice del mes (0-11)
 * @returns {string} Nombre del mes
 */
export function getMonthName(monthIndex) {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthIndex] || 'Mes inválido';
}

/**
 * Calcula porcentaje
 * @param {number} value - Valor actual
 * @param {number} total - Valor total
 * @returns {string} Porcentaje formateado (ej: "45.23%")
 */
export function calculatePercentage(value, total) {
    if (!total || total === 0) return '0%';
    return ((value / total) * 100).toFixed(2) + '%';
}

/**
 * Ordena un array de objetos por una propiedad
 * @param {Array} array - Array a ordenar
 * @param {string} property - Propiedad por la que ordenar
 * @param {boolean} ascending - Orden ascendente (default: true)
 * @returns {Array} Array ordenado
 */
export function sortBy(array, property, ascending = true) {
    return [...array].sort((a, b) => {
        const aVal = a[property];
        const bVal = b[property];
        
        if (aVal < bVal) return ascending ? -1 : 1;
        if (aVal > bVal) return ascending ? 1 : -1;
        return 0;
    });
}

/**
 * Agrupa un array de objetos por una propiedad
 * @param {Array} array - Array a agrupar
 * @param {string} property - Propiedad por la que agrupar
 * @returns {Object} Objeto con grupos
 */
export function groupBy(array, property) {
    return array.reduce((groups, item) => {
        const key = item[property];
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(item);
        return groups;
    }, {});
}
