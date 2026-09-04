const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require('bcrypt');
const salt = 10;

router.get("/patients", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM patients");
    res.send(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// register the patients
router.post("/patients/post", async (req, res) => {
  try {
    const { patient_name, email, password, age, gender, phone_no, address } = req.body;

    const existing = await db.query("SELECT * FROM patients WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "patient already exists!" });
    }

    const hp = await bcrypt.hash(password, salt);

    const sql = `
      INSERT INTO patients(patient_name, email, password, hassed_password, age, gender, phone_no, address)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `;
    await db.query(sql, [patient_name, email, password, hp, age, gender, phone_no, address]);

    res.status(201).json({ patient_name, email, age, gender, phone_no, address });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// login the patients
router.post("/patients/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM patients WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "invalid email or password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.hassed_password);

    if (isMatch) {
      delete user.hassed_password;
      delete user.password;
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: "invalid" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// show the available doctors
router.get("/patients/book_appointment", async (req, res) => {
  const sql = `
    SELECT * FROM doctor_availability da
    JOIN doctors doc ON doc.id = da.doctor_id
    JOIN department dept ON dept.id = da.department_id
  `;
  try {
    const result = await db.query(sql);
    res.send(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get appointments
router.get("/patients/book_appointment/get", async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM appointment');
    res.send(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// post appointment
router.post("/patients/book_appointment/post", async (req, res) => {
  const { patient_id, doctor_id } = req.body;
  try {
    await db.query('INSERT INTO appointment(patient_id, doctor_id) VALUES ($1, $2)', [patient_id, doctor_id]);
    res.status(201).json({ patient_id, doctor_id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
