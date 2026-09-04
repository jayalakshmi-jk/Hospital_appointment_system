-- ============================================================
-- Hospital Appointment System - Supabase (Postgres) Schema
-- Run this in Supabase Dashboard -> SQL Editor -> New Query
-- (No need for CREATE DATABASE - Supabase already gives you one DB)
-- ============================================================

-- patients
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    patient_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    hassed_password VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(25) NOT NULL,
    phone_no VARCHAR(13) NOT NULL,
    address VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(25) DEFAULT 'patient',
    updated_by VARCHAR(25) DEFAULT 'patient'
);

CREATE INDEX p_email ON patients(email);
CREATE INDEX p_age ON patients(age);

-- department
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    dept_name VARCHAR(25),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(25) DEFAULT 'department',
    updated_by VARCHAR(25) DEFAULT 'department'
);

INSERT INTO department(dept_name) VALUES ('Cardiology');
INSERT INTO department(dept_name) VALUES ('Neurology');
INSERT INTO department(dept_name) VALUES ('Orthopedics');

-- doctors
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    doctor_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    department_id INT REFERENCES department(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(25) DEFAULT 'doctor',
    updated_by VARCHAR(25) DEFAULT 'doctor'
);

INSERT INTO doctors(doctor_name, department_id, email) VALUES ('Dr. Jaya', 1, 'jaya@gmail.com');
INSERT INTO doctors(doctor_name, department_id, email) VALUES ('Dr. Gokul', 2, 'gokul@gmail.com');
INSERT INTO doctors(doctor_name, department_id, email) VALUES ('Dr. Krishna', 3, 'krishna@gmail.com');

-- appointment
CREATE TABLE appointment (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id),
    doctor_id INT REFERENCES doctors(id),
    appointment_date DATE DEFAULT CURRENT_DATE NOT NULL,
    appointment_time TIME DEFAULT CURRENT_TIME NOT NULL,
    status VARCHAR(25) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(25) DEFAULT 'appointment',
    updated_by VARCHAR(25) DEFAULT 'appointment'
);

-- doctor_availability
CREATE TABLE doctor_availability (
    id SERIAL PRIMARY KEY,
    doctor_id INT REFERENCES doctors(id),
    available_date DATE DEFAULT CURRENT_DATE,
    available_time TIME DEFAULT CURRENT_TIME,
    department_id INT REFERENCES department(id),
    status VARCHAR(25) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(25) DEFAULT 'doctor_availability',
    updated_by VARCHAR(25) DEFAULT 'doctor_availability'
);

CREATE INDEX idx_doctor_id ON doctor_availability(doctor_id);
CREATE INDEX idx_department_id ON doctor_availability(department_id);

INSERT INTO doctor_availability(doctor_id, department_id, available_date, available_time) VALUES (1, 1, '2024-06-10', '10:00:00');
INSERT INTO doctor_availability(doctor_id, department_id, available_date, available_time) VALUES (1, 1, '2024-06-10', '11:00:00');
INSERT INTO doctor_availability(doctor_id, department_id, available_date, available_time) VALUES (2, 2, '2024-06-10', '12:00:00');
INSERT INTO doctor_availability(doctor_id, department_id, available_date, available_time) VALUES (3, 3, '2024-06-11', '10:00:00');

-- ============================================================
-- Postgres has no "ON UPDATE CURRENT_TIMESTAMP" like MySQL.
-- These triggers replicate that behaviour for updated_at columns.
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_patients_updated_at BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_doctors_updated_at BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_department_updated_at BEFORE UPDATE ON department FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_appointment_updated_at BEFORE UPDATE ON appointment FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_doctor_availability_updated_at BEFORE UPDATE ON doctor_availability FOR EACH ROW EXECUTE FUNCTION set_updated_at();
