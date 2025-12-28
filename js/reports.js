// =====================================================
// SISTEMA DE REPORTES - CONTROL CENTER PRO
// =====================================================

const API_BASE = 'http://localhost:3000/api';

// Función para auto-formato de cédula dominicana
function formatCedulaInput(input) {
    input.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 11) valor = valor.slice(0, 11);
        
        let formateado = '';
        if (valor.length > 0) formateado = valor.slice(0, 3);
        if (valor.length > 3) formateado += '-' + valor.slice(3, 10);
        if (valor.length > 10) formateado += '-' + valor.slice(10, 11);
        
        e.target.value = formateado;
    });
}

// Aplicar auto-formato a todos los campos de cédula
['payroll-employee', 'payments-employee', 'withholdings-employee'].forEach(id => {
    const input = document.getElementById(id);
    if (input) formatCedulaInput(input);
});

// Obtener mes actual como default
const today = new Date();
document.getElementById('payroll-month').valueAsDate = today;
document.getElementById('analytics-start-month').valueAsDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
document.getElementById('analytics-end-month').valueAsDate = today;

// =====================================================
// GESTIÓN DE TABS
// =====================================================

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        
        // Remover active de todos
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
        
        // Agregar active al clickeado
        e.target.classList.add('active');
        document.getElementById(tabName + '-tab').style.display = 'block';
    });
});

// =====================================================
// TAB 1: NÓMINA
// =====================================================

document.getElementById('view-payroll-btn').addEventListener('click', async () => {
    const month = document.getElementById('payroll-month').value;
    if (!month) {
        alert('Por favor selecciona un mes');
        return;
    }
    
    try {
        const resultsDiv = document.getElementById('payroll-preview');
        resultsDiv.style.display = 'block';
        showLoading(resultsDiv);
        
        const response = await fetch(`${API_BASE}/reports/payment-history?startDate=${month}-01&endDate=${month}-31`);
        const data = await response.json();
        
        if (!data.success) throw new Error(data.error);
        
        displayPaymentPreview(data.data);
    } catch (error) {
        showAlert('❌ Error: ' + error.message, 'error');
    }
});

function displayPaymentPreview(payments) {
    const resultsDiv = document.getElementById('payroll-preview');
    
    if (!payments || payments.length === 0) {
        resultsDiv.innerHTML = '<p style="text-align: center; color: #666;">No hay datos de nómina para este mes</p>';
        return;
    }
    
    let html = `
        <table class="results-table">
            <thead>
                <tr>
                    <th>Cédula</th>
                    <th>Fecha</th>
                    <th>Salario</th>
                    <th>Bonos</th>
                    <th>Descuentos</th>
                    <th>Neto</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    let totalSalary = 0, totalBonus = 0, totalDeduc = 0, totalNet = 0;
    
    payments.forEach(p => {
        const salary = parseFloat(p.salary_amount || 0);
        const bonus = parseFloat(p.bonus || 0);
        const deductions = parseFloat(p.deductions || 0);
        const net = parseFloat(p.net_amount || 0);
        
        totalSalary += salary;
        totalBonus += bonus;
        totalDeduc += deductions;
        totalNet += net;
        
        html += `
            <tr>
                <td>${p.employee_cedula || '-'}</td>
                <td>${new Date(p.payment_date).toLocaleDateString('es-DO')}</td>
                <td>RD$ ${formatCurrency(salary)}</td>
                <td>RD$ ${formatCurrency(bonus)}</td>
                <td>RD$ ${formatCurrency(deductions)}</td>
                <td><strong>RD$ ${formatCurrency(net)}</strong></td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
        <div class="info-card">
            <div class="info-box">
                <h3>Total Salario</h3>
                <p class="currency">RD$ ${formatCurrency(totalSalary)}</p>
            </div>
            <div class="info-box">
                <h3>Total Bonos</h3>
                <p class="currency">RD$ ${formatCurrency(totalBonus)}</p>
            </div>
            <div class="info-box">
                <h3>Total Descuentos</h3>
                <p class="currency">RD$ ${formatCurrency(totalDeduc)}</p>
            </div>
            <div class="info-box">
                <h3>Total Neto</h3>
                <p class="currency">RD$ ${formatCurrency(totalNet)}</p>
            </div>
        </div>
    `;
    
    resultsDiv.innerHTML = html;
}

document.getElementById('generate-pdf-btn').addEventListener('click', async () => {
    const month = document.getElementById('payroll-month').value;
    if (!month) {
        alert('Por favor selecciona un mes');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/reports/payroll-pdf?month=${month}`);
        if (!response.ok) throw new Error('Error generando PDF');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nomina_${month}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        showAlert('✅ PDF descargado exitosamente', 'success');
    } catch (error) {
        showAlert('❌ Error: ' + error.message, 'error');
    }
});

document.getElementById('generate-excel-btn').addEventListener('click', async () => {
    const month = document.getElementById('payroll-month').value;
    if (!month) {
        alert('Por favor selecciona un mes');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/reports/payroll-excel?month=${month}`);
        if (!response.ok) throw new Error('Error generando Excel');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nomina_${month}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        showAlert('✅ Excel descargado exitosamente', 'success');
    } catch (error) {
        showAlert('❌ Error: ' + error.message, 'error');
    }
});

// =====================================================
// TAB 2: PAGOS
// =====================================================

document.getElementById('search-payments-btn').addEventListener('click', async () => {
    const fromDate = document.getElementById('payments-from-date').value;
    const toDate = document.getElementById('payments-to-date').value;
    const employee = document.getElementById('payments-employee').value;
    
    try {
        let url = `${API_BASE}/payments/history?`;
        if (fromDate) url += `startDate=${fromDate}&`;
        if (toDate) url += `endDate=${toDate}&`;
        if (employee) url += `employeeCedula=${employee}&`;
        
        showLoading(document.getElementById('payments-results'));
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.success) throw new Error(data.error);
        
        displayPaymentsTable(data.data);
    } catch (error) {
        showAlert('❌ Error: ' + error.message, 'error');
    }
});

function displayPaymentsTable(payments) {
    const resultsDiv = document.getElementById('payments-results');
    
    if (payments.length === 0) {
        resultsDiv.innerHTML = '<p style="text-align: center; color: #666;">No hay registros</p>';
        return;
    }
    
    let html = `
        <table class="results-table">
            <thead>
                <tr>
                    <th>Cédula</th>
                    <th>Fecha de Pago</th>
                    <th>Salario</th>
                    <th>Bonos</th>
                    <th>Descuentos</th>
                    <th>Neto</th>
                    <th>Método</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    let totalSalary = 0, totalBonus = 0, totalDeduc = 0, totalNet = 0;
    
    payments.forEach(p => {
        totalSalary += parseFloat(p.salary_amount || 0);
        totalBonus += parseFloat(p.bonus || 0);
        totalDeduc += parseFloat(p.deductions || 0);
        totalNet += parseFloat(p.net_amount || 0);
        
        html += `
            <tr>
                <td>${p.employee_cedula}</td>
                <td>${new Date(p.payment_date).toLocaleDateString('es-DO')}</td>
                <td>RD$ ${formatCurrency(p.salary_amount)}</td>
                <td>RD$ ${formatCurrency(p.bonus || 0)}</td>
                <td>RD$ ${formatCurrency(p.deductions || 0)}</td>
                <td><strong>RD$ ${formatCurrency(p.net_amount)}</strong></td>
                <td>${p.payment_method || '-'}</td>
                <td><span class="badge">${p.status}</span></td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
        <div class="info-card">
            <div class="info-box">
                <h3>Salario Total</h3>
                <p class="value">RD$</p>
                <p class="currency">${formatCurrency(totalSalary)}</p>
            </div>
            <div class="info-box">
                <h3>Total Bonos</h3>
                <p class="value">RD$</p>
                <p class="currency">${formatCurrency(totalBonus)}</p>
            </div>
            <div class="info-box">
                <h3>Total Descuentos</h3>
                <p class="value">RD$</p>
                <p class="currency">${formatCurrency(totalDeduc)}</p>
            </div>
            <div class="info-box">
                <h3>Neto Total</h3>
                <p class="value">RD$</p>
                <p class="currency">${formatCurrency(totalNet)}</p>
            </div>
        </div>
    `;
    
    resultsDiv.innerHTML = html;
}

// =====================================================
// TAB 3: AUDITORÍA
// =====================================================

document.getElementById('load-audit-btn').addEventListener('click', async () => {
    const action = document.getElementById('audit-action').value;
    const fromDate = document.getElementById('audit-from-date').value;
    const toDate = document.getElementById('audit-to-date').value;
    
    try {
        let url = `${API_BASE}/reports/audit-log?`;
        if (action) url += `actionType=${action}&`;
        if (fromDate) url += `startDate=${fromDate}&`;
        if (toDate) url += `endDate=${toDate}&`;
        
        showLoading(document.getElementById('audit-results'));
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.success) throw new Error(data.error);
        
        displayAuditLog(data.data);
    } catch (error) {
        showAlert('❌ Error: ' + error.message, 'error');
    }
});

function displayAuditLog(logs) {
    const resultsDiv = document.getElementById('audit-results');
    
    if (logs.length === 0) {
        resultsDiv.innerHTML = '<p style="text-align: center; color: #666;">No hay registros</p>';
        return;
    }
    
    let html = '<div>';
    
    logs.forEach(log => {
        const actionColor = {
            'CREATE': '#27ae60',
            'UPDATE': '#f39c12',
            'DELETE': '#e74c3c'
        }[log.action] || '#667eea';
        
        const actionLabel = {
            'CREATE': 'Crear',
            'UPDATE': 'Actualizar',
            'DELETE': 'Eliminar'
        }[log.action] || log.action;
        
        html += `
            <div class="audit-detail" style="border-left-color: ${actionColor};">
                <h4>${actionLabel} - ${log.table_name}</h4>
                <div class="detail-row">
                    <span class="detail-label">Fecha:</span>
                    <span class="detail-value">${new Date(log.changed_at).toLocaleString('es-DO')}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Admin:</span>
                    <span class="detail-value">${log.admin_name || log.admin_cedula || 'Sistema'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Empleado:</span>
                    <span class="detail-value">${log.employee_name || log.employee_cedula || '-'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Cambios:</span>
                    <span class="detail-value">${log.changes_description || 'Ver detalles'}</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    resultsDiv.innerHTML = html;
}

// =====================================================
// TAB 4: ANÁLISIS
// =====================================================

// Análisis de Crecimiento Salarial
document.getElementById('load-analytics-btn').addEventListener('click', async () => {
    const startMonth = document.getElementById('analytics-start-month').value;
    const endMonth = document.getElementById('analytics-end-month').value;
    
    if (!startMonth || !endMonth) {
        alert('Por favor selecciona ambas fechas');
        return;
    }
    
    try {
        showLoading(document.getElementById('analytics-results'));
        
        const response = await fetch(`${API_BASE}/reports/salary-growth?startMonth=${startMonth}&endMonth=${endMonth}`);
        const data = await response.json();
        
        if (!data.success) throw new Error(data.error || 'Error en la solicitud');
        
        displaySalaryGrowthAnalysis(data);
    } catch (error) {
        showAlert('❌ Error: ' + error.message, 'error');
        document.getElementById('analytics-results').innerHTML = '';
    }
});

function displaySalaryGrowthAnalysis(data) {
    const resultsDiv = document.getElementById('analytics-results');
    
    if (!data.data || data.data.length === 0) {
        resultsDiv.innerHTML = `<p style="text-align: center; color: #999;">No hay datos disponibles para el período seleccionado</p>`;
        return;
    }
    
    let html = '<div class="table-responsive">';
    html += '<table>';
    html += '<thead><tr>';
    html += '<th>Cédula</th>';
    html += '<th>Nombre</th>';
    
    // Si son meses diferentes, mostrar comparación
    if (data.data[0].startSalary !== undefined) {
        html += '<th>Salario Inicial</th>';
        html += '<th>Salario Final</th>';
        html += '<th>Diferencia</th>';
        html += '<th>% Cambio</th>';
    } else {
        // Si es el mismo mes, mostrar desglose completo
        html += '<th>Salario Base</th>';
        html += '<th>Bonificación</th>';
        html += '<th>Deducciones</th>';
        html += '<th>Retenciones</th>';
        html += '<th>Neto</th>';
    }
    html += '</tr></thead><tbody>';
    
    data.data.forEach(record => {
        html += '<tr>';
        html += `<td>${record.cedula}</td>`;
        html += `<td>${record.name}</td>`;
        
        if (record.startSalary !== undefined) {
            html += `<td>$${parseFloat(record.startSalary).toFixed(2)}</td>`;
            html += `<td>$${parseFloat(record.endSalary).toFixed(2)}</td>`;
            const diff = parseFloat(record.difference);
            const color = diff >= 0 ? '#4CAF50' : '#f44336';
            html += `<td style="color: ${color}">$${diff.toFixed(2)}</td>`;
            html += `<td style="color: ${color}">${record.percentageChange}%</td>`;
        } else {
            html += `<td>$${parseFloat(record.salary).toFixed(2)}</td>`;
            html += `<td>$${parseFloat(record.bonus || 0).toFixed(2)}</td>`;
            html += `<td>$${parseFloat(record.deductions || 0).toFixed(2)}</td>`;
            const totalWithholdings = (parseFloat(record.isr || 0) + parseFloat(record.afp || 0) + parseFloat(record.sfs || 0)).toFixed(2);
            html += `<td>$${totalWithholdings}</td>`;
            html += `<td>$${parseFloat(record.net).toFixed(2)}</td>`;
        }
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    html += '</div>';
    
    // Agregar resumen si son meses diferentes
    if (data.data[0].startSalary !== undefined) {
        const totalIncrease = data.data.reduce((sum, r) => sum + parseFloat(r.difference), 0);
        const avgPercentage = (data.data.reduce((sum, r) => sum + parseFloat(r.percentageChange), 0) / data.data.length).toFixed(2);
        
        html += '<div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 8px;">';
        html += '<h4>📊 Resumen:</h4>';
        html += `<p>Incremento Total: <strong style="color: #4CAF50;">$${totalIncrease.toFixed(2)}</strong></p>`;
        html += `<p>Incremento Promedio: <strong style="color: #4CAF50;">${avgPercentage}%</strong></p>`;
        html += '</div>';
    }
    
    resultsDiv.innerHTML = html;
}

document.getElementById('project-payroll-btn').addEventListener('click', async () => {
    const month = document.getElementById('projection-month').value;
    if (!month) {
        alert('Por favor selecciona un mes');
        return;
    }
    
    try {
        showLoading(document.getElementById('projection-results'));
        
        const response = await fetch(`${API_BASE}/reports/project-payroll`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ month })
        });
        
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        
        displayProjection(data);
    } catch (error) {
        showAlert('❌ Error: ' + error.message, 'error');
    }
});

function displayProjection(data) {
    const resultsDiv = document.getElementById('projection-results');
    
    const { summary, details } = data;
    
    let html = `
        <div class="info-card">
            <div class="info-box">
                <h3>Empleados</h3>
                <p class="value">${summary.employeeCount}</p>
            </div>
            <div class="info-box">
                <h3>Masa Salarial Proyectada</h3>
                <p class="currency">RD$ ${formatCurrency(summary.totalPayroll)}</p>
            </div>
            <div class="info-box">
                <h3>Total Retenciones</h3>
                <p class="currency">RD$ ${formatCurrency(summary.totalWithholdings)}</p>
            </div>
            <div class="info-box">
                <h3>Costo Neto</h3>
                <p class="currency">RD$ ${formatCurrency(summary.netCost)}</p>
            </div>
        </div>
        
        <table class="results-table">
            <thead>
                <tr>
                    <th>Cédula</th>
                    <th>Salario</th>
                    <th>Retenciones</th>
                    <th>Neto</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    details.forEach(emp => {
        html += `
            <tr>
                <td>${emp.cedula}</td>
                <td>RD$ ${formatCurrency(emp.salary)}</td>
                <td>RD$ ${formatCurrency(emp.withholdings)}</td>
                <td><strong>RD$ ${formatCurrency(emp.net)}</strong></td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    resultsDiv.innerHTML = html;
}

// =====================================================
// TAB 5: RETENCIONES
// =====================================================

document.getElementById('calculate-withholdings-btn').addEventListener('click', async () => {
    const salary = document.getElementById('withholdings-salary').value;
    if (!salary) {
        alert('Por favor ingresa un monto de salario');
        return;
    }
    
    try {
        showLoading(document.getElementById('withholdings-results'));
        
        const response = await fetch(`${API_BASE}/payroll/calculate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                employeeCedula: '000-0000000-0',
                salaryAmount: parseFloat(salary)
            })
        });
        
        const data = await response.json();
        if (!data.success) throw new Error(data.error);
        
        displayWithholdings(data.summary);
    } catch (error) {
        showAlert('❌ Error: ' + error.message, 'error');
    }
});

function displayWithholdings(summary) {
    const resultsDiv = document.getElementById('withholdings-results');
    
    let html = `
        <div class="withholdings-detail">
            <div class="withholdings-item">
                <div class="label">Salario</div>
                <div class="amount">RD$ ${formatCurrency(summary.salary)}</div>
            </div>
            <div class="withholdings-item">
                <div class="label">ISR (Impuesto)</div>
                <div class="amount" style="color: #e74c3c;">RD$ ${formatCurrency(summary.isr)}</div>
            </div>
            <div class="withholdings-item">
                <div class="label">AFP (Pensión)</div>
                <div class="amount" style="color: #f39c12;">RD$ ${formatCurrency(summary.afp)}</div>
            </div>
            <div class="withholdings-item">
                <div class="label">SFS (Salud)</div>
                <div class="amount" style="color: #e74c3c;">RD$ ${formatCurrency(summary.sfs)}</div>
            </div>
            <div class="withholdings-item">
                <div class="label">Total Retenciones</div>
                <div class="amount" style="color: #c0392b; font-size: 20px;">RD$ ${formatCurrency(summary.totalWithholdings)}</div>
            </div>
            <div class="withholdings-item" style="background: #d4edda;">
                <div class="label" style="color: #155724;">Salario Neto</div>
                <div class="amount" style="color: #27ae60;">RD$ ${formatCurrency(summary.net)}</div>
            </div>
        </div>
    `;
    
    resultsDiv.innerHTML = html;
}

// =====================================================
// FUNCIONES AUXILIARES
// =====================================================

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    document.querySelector('main').insertBefore(alertDiv, document.querySelector('.reports-tabs'));
    
    setTimeout(() => alertDiv.remove(), 5000);
}

function showLoading(element) {
    element.innerHTML = '<div class="loading"><div class="spinner"></div> Cargando...</div>';
}

function formatCurrency(value) {
    return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Botón volver atrás
document.getElementById('back-to-admin').addEventListener('click', () => {
    window.location.href = '/admin-dashboard.html';
});

// Botón logout
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/login.html';
});
