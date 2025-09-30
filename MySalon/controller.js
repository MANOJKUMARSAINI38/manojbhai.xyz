// const { pool } = require("../index");

// // Get salons
// exports.getSalons = async (req, res) => {
//   try {
//     const result = await pool.query("SELECT * FROM salon_profile");
//     res.json(result.rows || []);
//     console.log("resultsalonprofile", result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const pool = require("../config/db");

// Get salons
exports.getSalons = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM salon_profile");
    res.status(200).json({success:true, message: result.rows.length > 0 
        ? "successfound "
        : "successbutnotfound",result:result.rows || []});
    console.log("resultsalonprofile", result.rows);
  } catch (err) {
    res.status(500).json({ success:false,error: err.message });
  }
};

