const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/admin/book_appointment/get", async (req, res) => {
  try {
    const result = await db.query('SELECT COUNT(*) AS total FROM appointment');
    res.send(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/admin/patients/age_group", async (req, res) => {
  const sql = `
    SELECT CASE
      WHEN age < 18 THEN 'Kids(0-17)'
      WHEN age BETWEEN 18 AND 35 THEN 'Young Adult(18-35)'
      WHEN age BETWEEN 36 AND 50 THEN 'Middle Age(36-50)'
      ELSE '51+'
    END AS age_group, COUNT(*) AS patient_count
    FROM patients
    GROUP BY age_group
    ORDER BY MIN(age)
  `;
  try {
    const result = await db.query(sql);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/admin/book_appointment/app_list", async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM appointment a JOIN doctors d ON d.id = a.doctor_id JOIN patients p ON p.id = a.patient_id'
    );
    res.send(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
