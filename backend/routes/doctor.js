const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/doctor", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM doctors");
    res.send(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/doctor/login", async (req, res) => {
  const { email } = req.body;
  const sql = "SELECT * FROM doctors WHERE email = $1";

  try {
    const result = await db.query(sql, [email]);
    if (result.rows.length === 0) {
      return res.status(409).json({ message: "invalid, not matched" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/doctor/load-appointment/:id', async (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT a.*, p.*, d.* FROM appointment a
    JOIN patients p ON a.patient_id = p.id
    JOIN doctors d ON d.id = a.doctor_id
    WHERE a.doctor_id = $1
  `;
  try {
    const result = await db.query(sql, [id]);
    res.send(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/doctor/delete-appointment/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query('DELETE FROM appointment WHERE id = $1', [id]);
    res.send({ deleted: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/doctor/update-appointment/:id', async (req, res) => {
  const { appointment_date, appointment_time } = req.body;
  const id = req.params.id;

  if (!appointment_date || !appointment_time) {
    return res.status(400).json({ error: 'Appointment date and time are required' });
  }

  try {
    const result = await db.query(
      'UPDATE appointment SET appointment_date = $1, appointment_time = $2 WHERE id = $3',
      [appointment_date, appointment_time, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment updated successfully!!!!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/doctor/search-appointment', async (req, res) => {
  const search = req.query.search?.trim() || "";
  const doctor_id = req.query.doctor_id;

  const sql = `
    SELECT a.*, p.patient_name FROM appointment a
    JOIN patients p ON a.patient_id = p.id
    JOIN doctors d ON d.id = a.doctor_id
    WHERE a.doctor_id = $1 AND p.patient_name ILIKE $2
  `;
  try {
    const result = await db.query(sql, [doctor_id, `%${search}%`]);
    res.send(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
