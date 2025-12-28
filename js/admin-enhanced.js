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

    // Funciones para Modal de Agregar Empleado (Definir primero)
    window.openAddEmployeeModal = function() {
        const modal = document.getElementById('add-employee-modal-overlay');
        const form = document.getElementById('add-employee-form-modal');
        form.reset();
        document.getElementById('modal-employee-start-date').value = new Date().toISOString().split('T')[0];
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    window.closeAddEmployeeModal = function() {
        const modal = document.getElementById('add-employee-modal-overlay');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    async function submitAddEmployeeForm() {
        const code = document.getElementById('modal-employee-code').value;
        const name = document.getElementById('modal-employee-name').value;
        const email = document.getElementById('modal-employee-email').value;
        const position = document.getElementById('modal-employee-position').value;
        const salary = parseFloat(document.getElementById('modal-employee-salary').value);
        const hours = parseInt(document.getElementById('modal-employee-hours').value);
        const startDate = document.getElementById('modal-employee-start-date').value;
        const password = document.getElementById('modal-employee-password').value;

        const statusDiv = document.getElementById('modal-status-message');

        try {
            const response = await fetch('/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: code,
                    name: name,
                    position: position,
                    salary: salary,
                    hours_per_day: hours,
                    start_date: startDate,
                    password: password,
                    role: 'employee',
                    daily_wage: salary / 22
                })
            });

            const data = await response.json();

            if (response.ok) {
                showAddEmployeeStatus('✅ Empleado agregado correctamente', 'success');
                setTimeout(() => {
                    window.closeAddEmployeeModal();
                    renderDashboard();
                }, 1500);
            } else {
                showAddEmployeeStatus('❌ Error: ' + (data.error || data.message || 'No se pudo agregar el empleado'), 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showAddEmployeeStatus('❌ Error de conexión: ' + error.message, 'error');
        }
    }

    function showAddEmployeeStatus(message, type) {
        const statusDiv = document.getElementById('modal-status-message');
        statusDiv.textContent = message;
        statusDiv.className = `status-message ${type} show`;

        if (type === 'error') {
            setTimeout(() => {
                statusDiv.classList.remove('show');
            }, 5000);
        }
    }

    // Elementos del DOM
    const modal = document.getElementById('employee-modal');
    const detailsModal = document.getElementById('employee-details-modal');
    const addEmployeeBtn = document.getElementById('add-employee-btn-nav');
    const viewEmployeesBtn = document.getElementById('view-employees-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const employeeForm = document.getElementById('employee-form');
    const employeesContainer = document.getElementById('employees-container');
    const logoutBtn = document.getElementById('logout-btn');
    const searchInput = document.getElementById('search-input');
    const salaryInput = document.getElementById('employee-salary-modal');
    const dailyWageInput = document.getElementById('employee-daily-wage');
    
    // Modal de agregar empleado
    const addEmployeeModal = document.getElementById('add-employee-modal-overlay');
    const addEmployeeFormModal = document.getElementById('add-employee-form-modal');
    const modalSalaryInput = document.getElementById('modal-employee-salary');
    const modalDailyWageInput = document.getElementById('modal-employee-daily-wage');

    // Event Listeners
    addEmployeeBtn.addEventListener('click', () => window.openAddEmployeeModal());
    viewEmployeesBtn.addEventListener('click', () => {
        document.getElementById('employees-section').scrollIntoView({ behavior: 'smooth' });
    });
    cancelBtn.addEventListener('click', () => closeModal());
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (e.target.closest('#employee-modal')) closeModal();
            if (e.target.closest('#employee-details-modal')) closeDetailsModal();
        });
    });

    logoutBtn.addEventListener('click', async () => {
        logout();
        window.location.href = 'login.html';
    });

    // Modal de agregar empleado - evento submit
    addEmployeeFormModal.addEventListener('submit', async (e) => {
        e.preventDefault();
        await submitAddEmployeeForm();
    });

    // Calcular salario diario en modal de agregar
    modalSalaryInput.addEventListener('change', () => {
        const monthly = parseFloat(modalSalaryInput.value);
        if (monthly) {
            modalDailyWageInput.value = (monthly / 22).toFixed(2);
        }
    });

    // Configurar fecha de inicio con hoy
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('modal-employee-start-date').value = today;

    // Calcular salario diario automáticamente
    salaryInput.addEventListener('change', () => {
        const monthly = parseFloat(salaryInput.value);
        if (monthly) {
            dailyWageInput.value = (monthly / 22).toFixed(2);
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

    // Enviar formulario
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

    // Funciones Modal
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

        modal.style.display = 'flex';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    function closeDetailsModal() {
        detailsModal.style.display = 'none';
    }

    // Renderizar lista de empleados
    async function renderEmployeeList(employees) {
        employeesContainer.innerHTML = '';

        for (const emp of employees) {
            const details = await getEmployeeDetails(emp.id);
            const card = document.createElement('div');
            card.className = 'employee-card';
            card.innerHTML = `
                <img src="${emp.photo_url || 'https://i.pravatar.cc/150?u=' + emp.id}" 
                    alt="${emp.name}" class="employee-photo">
                <div class="employee-info">
                    <div class="info-item">
                        <span class="info-label">ID</span>
                        <span class="info-value">${emp.id}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Nombre</span>
                        <span class="info-value">${emp.name}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Posición</span>
                        <span class="info-value">${emp.position || 'N/A'}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Salario</span>
                        <span class="info-value">${formatCurrency(emp.salary)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Salario Diario</span>
                        <span class="info-value">${formatCurrency(emp.daily_wage || emp.salary / 22)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Horas/Día</span>
                        <span class="info-value">${emp.hours_per_day || 8} hrs</span>
                    </div>
                </div>
                <div class="employee-actions">
                    <button class="btn-action btn-view" onclick="viewEmployeeDetails('${emp.id}')">
                        👁️ Ver
                    </button>
                    <button class="btn-action btn-edit" onclick="editEmployee('${emp.id}')">
                        ✏️ Editar
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteEmployeeConfirm('${emp.id}')">
                        🗑️ Eliminar
                    </button>
                </div>
            `;
            employeesContainer.appendChild(card);
        }
    }

    // Funciones globales (para onclick)
    window.viewEmployeeDetails = async (employeeId) => {
        const details = await getEmployeeDetails(employeeId);
        const income = await getEmployeeIncome(employeeId);

        if (details) {
            const daysWorked = calculateDaysWorked(details.start_date);
            
            document.getElementById('detail-photo').src = details.photo_url;
            document.getElementById('detail-name').textContent = details.name;
            document.getElementById('detail-position').textContent = details.position || 'N/A';
            document.getElementById('detail-role').textContent = details.role;
            document.getElementById('detail-salary').textContent = formatCurrency(details.salary);
            document.getElementById('detail-daily-wage').textContent = formatCurrency(details.daily_wage);
            document.getElementById('detail-hours-per-day').textContent = details.hours_per_day + ' hrs';
            document.getElementById('detail-days-worked').textContent = daysWorked + ' días';
            document.getElementById('detail-total-income').textContent = formatCurrency(details.total_income);
            document.getElementById('detail-start-date').textContent = formatDate(details.start_date);

            // Gráfico de ingresos
            if (income && income.length > 0) {
                const chartData = generateIncomeChartData(income);
                const ctx = document.getElementById('income-trend-chart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: chartData,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: true }
                        },
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                });
            }

            detailsModal.style.display = 'flex';
        }
    };

    window.editEmployee = async (employeeId) => {
        const employees = await getAllEmployees();
        const employee = employees.find(e => e.id === employeeId);
        if (employee) openModal(employee);
    };

    window.deleteEmployeeConfirm = async (employeeId) => {
        if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
            await deleteEmployee(employeeId);
            await renderDashboard();
        }
    };

    // Renderizar gráficos
    let salaryChartInstance = null;
    async function renderSalaryChart() {
        const ctx = document.getElementById('salary-chart');
        if (!ctx) return;

        const salaryRanges = await getSalaryDistribution();
        const chartData = {
            labels: Object.keys(salaryRanges),
            datasets: [{
                label: 'Número de Empleados',
                data: Object.values(salaryRanges),
                backgroundColor: [
                    'rgba(52, 152, 219, 0.7)',
                    'rgba(26, 188, 156, 0.7)',
                    'rgba(241, 196, 15, 0.7)',
                    'rgba(231, 76, 60, 0.7)',
                ],
                borderWidth: 1
            }]
        };

        if (salaryChartInstance) salaryChartInstance.destroy();
        salaryChartInstance = new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                plugins: { legend: { display: false } }
            }
        });
    }

    let profitsChartInstance = null;
    async function renderProfitsChart() {
        const ctx = document.getElementById('profits-chart');
        if (!ctx) return;

        const profitsData = await getMonthlyProfits();
        const chartData = {
            labels: profitsData.map(d => d.month),
            datasets: [{
                label: 'Ganancias',
                data: profitsData.map(d => d.profit),
                fill: false,
                borderColor: '#3498db',
                tension: 0.4
            }]
        };

        if (profitsChartInstance) profitsChartInstance.destroy();
        profitsChartInstance = new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // Renderizar estadísticas
    function renderStats(employees) {
        const total = employees.length;
        const totalSalary = employees.reduce((sum, e) => sum + parseFloat(e.salary), 0);
        const average = total > 0 ? totalSalary / total : 0;

        document.getElementById('total-employees').textContent = total;
        document.getElementById('average-salary').textContent = formatCurrency(average);
        document.getElementById('total-payroll').textContent = formatCurrency(totalSalary);
    }

    // Renderizar dashboard completo
    async function renderDashboard() {
        const employees = await getAllEmployees();
        renderStats(employees);
        renderEmployeeList(employees);
        await renderSalaryChart();
        await renderProfitsChart();
    }

    // Funciones para Modal de Agregar Empleado
    window.openAddEmployeeModal = function() {
        const modal = document.getElementById('add-employee-modal-overlay');
        const form = document.getElementById('add-employee-form-modal');
        form.reset();
        document.getElementById('modal-employee-start-date').value = new Date().toISOString().split('T')[0];
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    window.closeAddEmployeeModal = function() {
        const modal = document.getElementById('add-employee-modal-overlay');
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // Cerrar modal al hacer click fuera
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('add-employee-modal-overlay');
        if (event.target === modal) {
            closeAddEmployeeModal();
        }
    });

    // Enviar formulario de agregar empleado
    async function submitAddEmployeeForm() {
        const code = document.getElementById('modal-employee-code').value;
        const name = document.getElementById('modal-employee-name').value;
        const email = document.getElementById('modal-employee-email').value;
        const position = document.getElementById('modal-employee-position').value;
        const salary = parseFloat(document.getElementById('modal-employee-salary').value);
        const hours = parseInt(document.getElementById('modal-employee-hours').value);
        const startDate = document.getElementById('modal-employee-start-date').value;
        const password = document.getElementById('modal-employee-password').value;

        const statusDiv = document.getElementById('modal-status-message');

        try {
            const response = await fetch('/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: code,
                    name: name,
                    position: position,
                    salary: salary,
                    hours_per_day: hours,
                    start_date: startDate,
                    password: password,
                    role: 'employee',
                    daily_wage: salary / 22
                })
            });

            const data = await response.json();

            if (response.ok) {
                showAddEmployeeStatus('✅ Empleado agregado correctamente', 'success');
                setTimeout(() => {
                    closeAddEmployeeModal();
                    renderDashboard();
                }, 1500);
            } else {
                showAddEmployeeStatus('❌ Error: ' + (data.error || data.message || 'No se pudo agregar el empleado'), 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showAddEmployeeStatus('❌ Error de conexión: ' + error.message, 'error');
        }
    }

    function showAddEmployeeStatus(message, type) {
        const statusDiv = document.getElementById('modal-status-message');
        statusDiv.textContent = message;
        statusDiv.className = `status-message ${type} show`;

        if (type === 'error') {
            setTimeout(() => {
                statusDiv.classList.remove('show');
            }, 5000);
        }
    }
})
