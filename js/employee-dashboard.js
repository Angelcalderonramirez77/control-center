document.addEventListener('DOMContentLoaded', () => {
    // Simulación: Recuperar datos del usuario desde sessionStorage
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    if (!currentUser || currentUser.role !== 'employee') {
        // Si no hay usuario o no es un empleado, redirigir al login
        window.location.href = 'login.html';
        return;
    }

    // Poblar los datos en la página
    document.getElementById('employee-name').textContent = currentUser.name;
    document.getElementById('employee-salary').textContent = currentUser.salary.toLocaleString('en-US');

    // Funcionalidad de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }
});
