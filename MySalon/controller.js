const { pool } = require("../index");

// Get salons
exports.getSalons = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM salon_profile");
    res.json(result.rows || []);
    console.log("resultsalonprofile", result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
