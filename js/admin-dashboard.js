// Importaciones
import {
    getAllEmployees,
    getEmployeeDetails,
    getEmployeeIncome,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    calculateDaysWorked,
    generateIncomeChartData,
    formatCurrency,
    formatDate
} from './employees-api.js';

import { logout } from './shared/auth.js';
import { getMonthlyProfits, getSalaryDistribution } from './shared/api.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar sesión
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser || currentUser.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    // Mostrar nombre del administrador en el header
    const adminNameDisplay = document.getElementById('admin-name-display');
    if (adminNameDisplay && currentUser.name) {
        adminNameDisplay.textContent = currentUser.name.toUpperCase();
    }

    // =============================================
    // MODAL Y FORMULARIOS YA ELIMINADOS
    // =============================================

    // =============================================
    // ELEMENTOS DEL DOM
    // =============================================
    
    const modal = document.getElementById('employee-modal');
    const addEmployeeBtn = document.getElementById('add-employee-btn-nav');
    const viewEmployeesBtn = document.getElementById('view-employees-btn');
    const reportsBtn = document.getElementById('reports-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const employeeForm = document.getElementById('employee-form');
    const employeesContainer = document.getElementById('employees-container');
    const logoutBtn = document.getElementById('logout-btn');
    const searchInput = document.getElementById('search-input');
    const salaryInput = document.getElementById('employee-salary-modal');
    const dailyWageInput = document.getElementById('employee-daily-wage');
    const cedulaInput = document.getElementById('employee-code');
    const passwordInput = document.getElementById('employee-password');

    // =============================================
    // EVENT LISTENERS
    // =============================================
    
    addEmployeeBtn.addEventListener('click', () => openModal());
    
    viewEmployeesBtn.addEventListener('click', () => {
        document.getElementById('employees-section').scrollIntoView({ behavior: 'smooth' });
    });
    
    reportsBtn.addEventListener('click', () => {
        window.location.href = '/reports.html';
    });
    
    cancelBtn.addEventListener('click', () => closeModal());

    // Auto-formato de cédula dominicana (XXX-XXXXXXX-X) y copiar como contraseña
    cedulaInput.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, ''); // Solo dígitos
        
        // Limitar a 11 dígitos
        if (valor.length > 11) {
            valor = valor.slice(0, 11);
        }
        
        // Formatear con guiones: XXX-XXXXXXX-X
        let formateado = '';
        if (valor.length > 0) {
            formateado = valor.slice(0, 3);
        }
        if (valor.length > 3) {
            formateado += '-' + valor.slice(3, 10);
        }
        if (valor.length > 10) {
            formateado += '-' + valor.slice(10, 11);
        }
        
        e.target.value = formateado;
        
        // Copiar solo números como contraseña
        passwordInput.value = valor;
    });
    
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target.closest('#employee-modal')) closeModal();
        });
    });

    logoutBtn.addEventListener('click', async () => {
        logout();
        window.location.href = 'login.html';
    });

    // Cerrar modal al hacer click fuera
    document.addEventListener('click', (e) => {
        if (e.target.id === 'employee-modal') {
            closeModal();
        }
    });

    // Buscar empleados
    searchInput.addEventListener('input', async (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const allEmployees = await getAllEmployees();
        const filtered = allEmployees.filter(emp =>
            emp.name.toLowerCase().includes(searchTerm) ||
            emp.id.toLowerCase().includes(searchTerm)
        );
        renderEmployeeList(filtered);
    });

    // Enviar formulario modal de edición
    employeeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('employee-id-hidden').value;
        const employeeData = {
            id: document.getElementById('employee-code').value,
            name: document.getElementById('employee-name-modal').value,
            role: document.getElementById('employee-role').value,
            salary: parseFloat(document.getElementById('employee-salary-modal').value),
            password: document.getElementById('employee-password').value,
            position: document.getElementById('employee-position').value,
            daily_wage: parseFloat(document.getElementById('employee-daily-wage').value),
            hours_per_day: parseInt(document.getElementById('employee-hours-per-day').value),
            start_date: document.getElementById('employee-start-date').value
        };

        if (id) {
            await updateEmployee(id, employeeData);
        } else {
            await createEmployee(employeeData);
        }

        closeModal();
        await renderDashboard();
    });

    // Cerrar modal al hacer click fuera
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('add-employee-modal-overlay');
        if (event.target === modal) {
            window.closeAddEmployeeModal();
        }
    });

    // =============================================
    // FUNCIONES MODALES
    // =============================================
    
    function openModal(employee = null) {
        const form = document.getElementById('employee-form');
        form.reset();

        if (employee) {
            document.getElementById('modal-title').textContent = 'Editar Empleado';
            document.getElementById('employee-id-hidden').value = employee.id;
            document.getElementById('employee-code').value = employee.id;
            document.getElementById('employee-code').readOnly = true;
            document.getElementById('employee-name-modal').value = employee.name;
            document.getElementById('employee-role').value = employee.role;
            document.getElementById('employee-salary-modal').value = employee.salary;
            document.getElementById('employee-position').value = employee.position || '';
            document.getElementById('employee-daily-wage').value = employee.daily_wage || '';
            document.getElementById('employee-hours-per-day').value = employee.hours_per_day || 8;
            document.getElementById('employee-start-date').value = employee.start_date || '';
            document.getElementById('employee-password').required = false;
        } else {
            document.getElementById('modal-title').textContent = 'Agregar Empleado';
            document.getElementById('employee-id-hidden').value = '';
            document.getElementById('employee-code').readOnly = false;
            document.getElementById('employee-password').required = true;
            document.getElementById('employee-start-date').value = new Date().toISOString().split('T')[0];
        }

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // =============================================
    // RENDERIZAR LISTA DE EMPLEADOS
    // =============================================
    
    async function renderEmployeeList(employees) {
        employeesContainer.innerHTML = '';

        for (const emp of employees) {
            const details = await getEmployeeDetails(emp.id);
            const card = document.createElement('div');
            card.className = 'employee-card';
            card.dataset.employeeId = emp.id;
            card.innerHTML = `
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(emp.name)}&background=667eea&color=fff&size=100" 
                     alt="${emp.name}" class="employee-photo">
                <div class="employee-info">
                    <div>
                        <strong>${emp.name}</strong>
                        <p style="color: #999; font-size: 0.9em;">ID: ${emp.id}</p>
                    </div>
                    <div>
                        <p><small>Rol: <span style="font-weight: 600;">${emp.role === 'admin' ? 'Administrador' : 'Empleado'}</span></small></p>
                        <p><small>Salario: <span style="font-weight: 600; color: #27ae60;">$${formatCurrency(emp.salary)}</span></small></p>
                    </div>
                </div>
                <div class="employee-actions">
                    <button class="btn-action btn-edit" data-action="edit" data-employee-id="${emp.id}" title="Editar empleado">
                        ✏️ Editar
                    </button>
                    <button class="btn-action btn-view" data-action="view" data-employee-id="${emp.id}" title="Ver detalles">
                        👁️ Ver
                    </button>
                    <button class="btn-action btn-delete" data-action="delete" data-employee-id="${emp.id}" title="Eliminar empleado">
                        🗑️ Eliminar
                    </button>
                </div>
            `;
            employeesContainer.appendChild(card);
        }
    }

    // =============================================
    // FUNCIONES GLOBALES PARA BOTONES
    // =============================================
    // FUNCIONES GLOBALES PARA BOTONES
    // =============================================
    
    window.viewEmployeeDetails = async function(employeeId) {
        const employee = await getEmployeeDetails(employeeId);
        const income = await getEmployeeIncome(employeeId);
        
        const info = `
📋 INFORMACIÓN DEL EMPLEADO

👤 Nombre: ${employee.name}
🆔 ID: ${employee.id}
💼 Posición: ${employee.position || '-'}
👥 Rol: ${employee.role === 'admin' ? 'Administrador' : 'Empleado'}
💰 Salario Mensual: ${formatCurrency(employee.salary)}
📅 Salario Diario: ${formatCurrency(employee.daily_wage)}
⏰ Horas/Día: ${employee.hours_per_day || 8}
📊 Días Trabajados: ${income.days_worked}
💵 Ingreso Total: ${formatCurrency(income.total_income)}
🗓️ Fecha de Inicio: ${formatDate(employee.start_date)}
        `;
        
        alert(info.trim());
    }

    window.editEmployeeHandler = async function(employeeId) {
        const employee = await getEmployeeDetails(employeeId);
        openModal(employee);
    }

    window.deleteEmployeeHandler = async function(employeeId) {
        if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
            await deleteEmployee(employeeId);
            await renderDashboard();
        }
    }

    // =============================================
    // GRÁFICOS
    // =============================================
    
    function renderIncomeChart(data) {
        const ctx = document.getElementById('income-trend-chart').getContext('2d');
        
        if (window.incomeChart) {
            window.incomeChart.destroy();
        }

        window.incomeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Ingresos por Mes',
                    data: data.values,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 6,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: { font: { size: 14 } }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toFixed(0);
                            }
                        }
                    }
                }
            }
        });
    }

    async function renderSalaryChart() {
        const employees = await getAllEmployees();
        const salaryData = await getSalaryDistribution();
        
        const ctx = document.getElementById('salary-chart').getContext('2d');
        
        if (window.salaryChart) {
            window.salaryChart.destroy();
        }

        // Guardar datos para cambiar tipo de gráfico
        window.salaryChartData = {
            labels: employees.map(e => e.name),
            values: employees.map(e => e.salary)
        };

        window.salaryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: employees.map(e => e.name),
                datasets: [{
                    label: 'Salario Mensual',
                    data: employees.map(e => e.salary),
                    backgroundColor: '#667eea',
                    borderColor: '#764ba2',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true, labels: { font: { size: 14 } } }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'RD$ ' + value.toFixed(0);
                            }
                        }
                    }
                }
            }
        });
    }

    window.changeSalaryChartType = function(chartType) {
        if (!window.salaryChart || !window.salaryChartData) return;

        window.salaryChart.destroy();

        const ctx = document.getElementById('salary-chart').getContext('2d');
        const data = window.salaryChartData;

        const colors = {
            bar: { bg: '#667eea', border: '#764ba2' },
            line: { border: '#3498db', bg: 'rgba(52, 152, 219, 0.1)' },
            area: { border: '#e74c3c', bg: 'rgba(231, 76, 60, 0.1)' },
            pie: { bg: ['#667eea', '#764ba2', '#f39c12', '#e74c3c', '#27ae60', '#3498db'] }
        };

        const config = {
            bar: {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Salario Mensual (RD$)',
                        data: data.values,
                        backgroundColor: colors.bar.bg,
                        borderColor: colors.bar.border,
                        borderWidth: 2
                    }]
                }
            },
            line: {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Salario Mensual (RD$)',
                        data: data.values,
                        borderColor: colors.line.border,
                        backgroundColor: colors.line.bg,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 6,
                        pointBackgroundColor: colors.line.border,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }]
                }
            },
            area: {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Salario Mensual (RD$)',
                        data: data.values,
                        backgroundColor: colors.area.bg,
                        borderColor: colors.area.border,
                        borderWidth: 2
                    }]
                }
            },
            pie: {
                type: 'doughnut',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Distribución de Salarios',
                        data: data.values,
                        backgroundColor: colors.pie.bg,
                        borderColor: '#fff',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    layout: {
                        padding: 20
                    },
                    plugins: {
                        legend: { 
                            display: true, 
                            position: 'bottom',
                            padding: 15,
                            labels: { 
                                font: { size: 12 },
                                padding: 15
                            }
                        }
                    }
                }
            }
        };

        const selectedConfig = config[chartType];
        const options = selectedConfig.options || {
            responsive: true,
            plugins: {
                legend: { display: true, labels: { font: { size: 14 } } }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'RD$ ' + value.toFixed(0);
                        }
                    }
                }
            }
        };

        window.salaryChart = new Chart(ctx, {
            type: selectedConfig.type,
            data: selectedConfig.data,
            options: options
        });

        // Actualizar botones activos
        document.querySelectorAll('[data-chart-type]').forEach(btn => {
            if (btn.closest('.card:has(#salary-chart))')) {
                btn.classList.remove('active');
            }
        });
        
        // Más simple: buscar botones en la tarjeta de salarios
        const salaryCard = document.querySelector('#salary-chart').closest('.card');
        salaryCard.querySelectorAll('.chart-type-btn').forEach(btn => btn.classList.remove('active'));
        salaryCard.querySelector(`[data-chart-type="${chartType}"]`)?.classList.add('active');
    }

    async function renderProfitsChart() {
        // Generar datos de ganancias mensuales basados en empleados
        const employees = await getAllEmployees();
        
        // Últimos 6 meses
        const months = [];
        const currentDate = new Date();
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            months.push(date.toLocaleDateString('es-DO', { month: 'short', year: '2-digit' }));
        }

        // Calcular ganancias (simulado: ingresos - gastos básicos)
        const totalSalary = employees.reduce((sum, emp) => sum + parseFloat(emp.salary || 0), 0);
        const values = months.map(() => {
            // Simular ganancias con variación aleatoria
            return Math.floor(totalSalary * 0.5 + (Math.random() * totalSalary * 0.3));
        });

        const ctx = document.getElementById('profits-chart').getContext('2d');
        
        if (window.profitsChart) {
            window.profitsChart.destroy();
        }

        // Guardar datos para cambiar tipo de gráfico
        window.profitsChartData = {
            labels: months,
            values: values
        };

        window.profitsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Ganancias Mensuales (RD$)',
                    data: values,
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 6,
                    pointBackgroundColor: '#27ae60',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true, labels: { font: { size: 14 } } }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'RD$ ' + value.toFixed(0);
                            }
                        }
                    }
                }
            }
        });
    }

    // Función para cambiar tipo de gráfico de ganancias
    window.changeProfitsChartType = function(chartType) {
        if (!window.profitsChart || !window.profitsChartData) return;

        window.profitsChart.destroy();

        const ctx = document.getElementById('profits-chart').getContext('2d');
        const data = window.profitsChartData;

        const colors = {
            line: { border: '#27ae60', bg: 'rgba(39, 174, 96, 0.1)' },
            bar: { border: '#3498db', bg: '#3498db' },
            area: { border: '#e74c3c', bg: 'rgba(231, 76, 60, 0.1)' },
            pie: { border: '#f39c12', bg: ['#667eea', '#764ba2', '#f39c12', '#e74c3c', '#27ae60', '#3498db'] }
        };

        const config = {
            line: {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Ganancias Mensuales (RD$)',
                        data: data.values,
                        borderColor: colors.line.border,
                        backgroundColor: colors.line.bg,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 6,
                        pointBackgroundColor: colors.line.border,
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2
                    }]
                }
            },
            bar: {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Ganancias Mensuales (RD$)',
                        data: data.values,
                        backgroundColor: colors.bar.bg,
                        borderColor: '#2980b9',
                        borderWidth: 2
                    }]
                }
            },
            area: {
                type: 'bar',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Ganancias Mensuales (RD$)',
                        data: data.values,
                        backgroundColor: colors.area.bg,
                        borderColor: colors.area.border,
                        borderWidth: 2
                    }]
                }
            },
            pie: {
                type: 'doughnut',
                data: {
                    labels: data.labels,
                    datasets: [{
                        label: 'Ganancias por Mes',
                        data: data.values,
                        backgroundColor: colors.pie.bg,
                        borderColor: '#fff',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    layout: {
                        padding: 20
                    },
                    plugins: {
                        legend: { 
                            display: true, 
                            position: 'bottom',
                            padding: 15,
                            labels: { 
                                font: { size: 12 },
                                padding: 15
                            }
                        }
                    }
                }
            }
        };

        const selectedConfig = config[chartType];
        const options = selectedConfig.options || {
            responsive: true,
            plugins: {
                legend: { display: true, labels: { font: { size: 14 } } }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'RD$ ' + value.toFixed(0);
                        }
                    }
                }
            }
        };

        window.profitsChart = new Chart(ctx, {
            type: selectedConfig.type,
            data: selectedConfig.data,
            options: options
        });

        // Actualizar botones activos
        document.querySelectorAll('.chart-type-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-chart-type="${chartType}"]`)?.classList.add('active');
    }


    // =============================================
    // ESTADÍSTICAS
    // =============================================
    
    function renderStats(employees) {
        const total = employees.length;
        let average = 0;
        let totalSalary = 0;

        if (employees.length > 0) {
            totalSalary = employees.reduce((sum, emp) => {
                const salary = parseFloat(emp.salary) || 0;
                return sum + salary;
            }, 0);
            average = totalSalary / employees.length;
        }

        document.getElementById('total-employees').textContent = total;
        document.getElementById('average-salary').textContent = formatCurrency(average || 0);
        document.getElementById('total-payroll').textContent = formatCurrency(totalSalary || 0);
    }

    // =============================================
    // DASHBOARD
    // =============================================
    
    async function renderDashboard() {
        const employees = await getAllEmployees();
        renderStats(employees);
        renderEmployeeList(employees);
        await renderSalaryChart();
        await renderProfitsChart();
    }

    // Delegación de eventos para los botones de acción
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.btn-action');
        if (!btn) return;

        const employeeId = btn.dataset.employeeId;
        if (!employeeId) return;

        try {
            if (btn.classList.contains('btn-edit')) {
                const employee = await getEmployeeDetails(employeeId);
                if (employee) {
                    openModal(employee);
                } else {
                    console.error('No se pudo cargar la información del empleado');
                    alert('No se pudo cargar la información del empleado. Por favor, intente de nuevo.');
                }
            } else if (btn.classList.contains('btn-view')) {
                viewEmployeeDetails(employeeId);
            } else if (btn.classList.contains('btn-delete')) {
                if (confirm('¿Está seguro de que desea eliminar este empleado?')) {
                    const success = await deleteEmployee(employeeId);
                    if (success) {
                        await renderDashboard();
                    } else {
                        alert('No se pudo eliminar el empleado. Por favor, intente de nuevo.');
                    }
                }
            }
        } catch (error) {
            console.error('Error al procesar la acción:', error);
            alert('Ocurrió un error al procesar la acción. Por favor, intente de nuevo.');
        }
    });

    // Inicializar
    await renderDashboard();
});

// Hacer que las funciones estén disponibles globalmente para compatibilidad
window.editEmployeeHandler = async (employeeId) => {
    try {
        const employee = await getEmployeeDetails(employeeId);
        if (employee) {
            document.dispatchEvent(new CustomEvent('openEditModal', { detail: employee }));
        }
    } catch (error) {
        console.error('Error al editar empleado:', error);
    }
};

window.viewEmployeeDetails = (employeeId) => {
    window.location.href = `employee-dashboard.html?id=${employeeId}`;
};

window.deleteEmployeeHandler = async (employeeId) => {
    if (confirm('¿Está seguro de que desea eliminar este empleado?')) {
        const success = await deleteEmployee(employeeId);
        if (success) {
            // Recargar la lista de empleados
            const event = new Event('renderDashboard');
            document.dispatchEvent(event);
        } else {
            alert('No se pudo eliminar el empleado. Por favor, intente de nuevo.');
        }
    }
};
