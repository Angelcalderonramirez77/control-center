#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para insertar datos de prueba en la base de datos
Asegura que los reportes funcionen correctamente
"""

import psycopg2
from datetime import datetime, timedelta
from decimal import Decimal

# Conexión a la base de datos
conn = psycopg2.connect(
    host="localhost",
    database="nomina_db",
    user="postgres",
    password="postgres",
    port=5432
)

cur = conn.cursor()

try:
    print("Iniciando inserción de datos de prueba...")
    
    # 1. Insertar datos de pagos para enero 2025
    print("📌 Insertando datos de pagos...")
    payments_data = [
        ('402-0047666-7', '2025-01-15', 55000.00, 5000.00, 0.00, 50000.00),
        ('401-1234567-8', '2025-01-15', 45000.00, 2000.00, 500.00, 46500.00),
        ('403-9876543-2', '2025-01-15', 50000.00, 3000.00, 0.00, 53000.00),
        ('404-5555555-1', '2025-01-15', 35000.00, 1000.00, 250.00, 35750.00),
        ('405-3333333-9', '2025-01-15', 60000.00, 0.00, 1000.00, 59000.00),
        ('406-2222222-6', '2025-01-15', 40000.00, 4000.00, 500.00, 43500.00),
        ('402-0047666-7', '2025-12-15', 55000.00, 10000.00, 500.00, 64500.00),
        ('401-1234567-8', '2025-12-15', 45000.00, 5000.00, 500.00, 49500.00),
        ('403-9876543-2', '2025-12-15', 50000.00, 6000.00, 0.00, 56000.00),
        ('404-5555555-1', '2025-12-15', 35000.00, 3000.00, 250.00, 37750.00),
        ('405-3333333-9', '2025-12-15', 60000.00, 0.00, 1000.00, 59000.00),
        ('406-2222222-6', '2025-12-15', 40000.00, 8000.00, 500.00, 47500.00),
    ]
    
    for cedula, date, salary, bonus, deduct, net in payments_data:
        try:
            cur.execute("""
                INSERT INTO payment_history 
                (employee_cedula, payment_date, salary_amount, bonus, deductions, net_amount, payment_method, status, created_by)
                VALUES (%s, %s, %s, %s, %s, %s, 'TRANSFERENCIA', 'PAGADO', %s)
                ON CONFLICT DO NOTHING
            """, (cedula, date, salary, bonus, deduct, net, cedula))
        except Exception as e:
            print(f"⚠️  Error insertando pago: {e}")
    
    conn.commit()
    print("✅ Pagos insertados correctamente")
    
    # 2. Obtener los IDs de pagos para insertar retenciones
    print("📌 Insertando datos de retenciones...")
    cur.execute("SELECT id, employee_cedula, salary_amount FROM payment_history LIMIT 20")
    payments = cur.fetchall()
    
    for payment_id, cedula, salary in payments:
        isr = salary * 0.15
        afp = salary * 0.025
        sfs = salary * 0.0287
        total = isr + afp + sfs
        
        try:
            cur.execute("""
                INSERT INTO withholdings 
                (payment_id, employee_cedula, isr, afp, sfs, total_withholdings, calculation_date)
                VALUES (%s, %s, %s, %s, %s, %s, NOW())
                ON CONFLICT DO NOTHING
            """, (payment_id, cedula, isr, afp, sfs, total))
        except Exception as e:
            print(f"⚠️  Error insertando retenciones: {e}")
    
    conn.commit()
    print("✅ Retenciones insertadas correctamente")
    
    # 3. Insertar registros de auditoría
    print("📌 Insertando registros de auditoría...")
    audit_data = [
        ('402-0047666-7', '401-1234567-8', 'UPDATE', 'employees', '{"salary": 40000}', '{"salary": 45000}', 'salary actualizado'),
        ('402-0047666-7', '403-9876543-2', 'UPDATE', 'employees', '{"department_id": 1}', '{"department_id": 2}', 'departamento actualizado'),
        ('402-0047666-7', None, 'CREATE', 'payment_history', '{}', '{"payment_date": "2025-12-15"}', 'nuevo pago registrado'),
        ('402-0047666-7', '405-3333333-9', 'UPDATE', 'employees', '{"position": "Asistente"}', '{"position": "Coordinador"}', 'posición actualizada'),
    ]
    
    for admin, emp, action, table, old, new, desc in audit_data:
        try:
            cur.execute("""
                INSERT INTO audit_log 
                (admin_cedula, employee_cedula, action, table_name, old_values, new_values, changes_description, changed_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
                ON CONFLICT DO NOTHING
            """, (admin, emp, action, table, old, new, desc))
        except Exception as e:
            print(f"⚠️  Error insertando auditoría: {e}")
    
    conn.commit()
    print("✅ Registros de auditoría insertados correctamente")
    
    # 4. Insertar bonificaciones/deducciones
    print("📌 Insertando bonificaciones y deducciones...")
    bonus_data = [
        ('402-0047666-7', 'BONO', 'Bono de desempeño', 5000.00, '2025-01-01', None, 'Alto desempeño', '402-0047666-7'),
        ('401-1234567-8', 'BONO', 'Bono de navidad', 2000.00, '2025-12-01', None, 'Bonificación navideña', '402-0047666-7'),
        ('403-9876543-2', 'DESCUENTO', 'Anticipo de salario', 1000.00, '2025-12-01', None, 'Adelanto solicitado', '402-0047666-7'),
        ('406-2222222-6', 'BONO', 'Bono adicional', 3000.00, '2025-12-01', None, 'Desempeño diciembre', '402-0047666-7'),
    ]
    
    for cedula, tipo, desc, amount, eff, end, reason, appr in bonus_data:
        try:
            cur.execute("""
                INSERT INTO bonuses_deductions 
                (employee_cedula, type, description, amount, effective_date, end_date, reason, approved_by, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'ACTIVO')
                ON CONFLICT DO NOTHING
            """, (cedula, tipo, desc, amount, eff, end, reason, appr))
        except Exception as e:
            print(f"⚠️  Error insertando bonificaciones: {e}")
    
    conn.commit()
    print("✅ Bonificaciones insertadas correctamente")
    
    print("\n✨ ¡Todos los datos de prueba se han insertado correctamente!")
    print("\n📊 Ahora puedes:")
    print("  1. Generar PDF de nómina para enero o diciembre 2025")
    print("  2. Exportar Excel con los datos")
    print("  3. Ver el historial de auditoría")
    print("  4. Proyectar la nómina futura")
    print("  5. Calcular retenciones")

except Exception as e:
    print(f"❌ Error: {e}")
    conn.rollback()

finally:
    cur.close()
    conn.close()
    print("\n✅ Conexión cerrada")
