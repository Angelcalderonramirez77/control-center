const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const chartRoutes = require('./routes/charts');
const reportRoutes = require('./routes/reports');
const adminRoutes = require('./routes/admin');
const payrollRoutes = require('./routes/payroll');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Para parsear el body de las peticiones como JSON

// Servir archivos estáticos desde la carpeta padre
app.use(express.static(path.join(__dirname, '..')));

// Rutas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'login.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/charts', chartRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin/departments', adminRoutes);
app.use('/api/admin/employees', adminRoutes);
app.use('/api/payments', payrollRoutes);
app.use('/api/payroll', payrollRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
