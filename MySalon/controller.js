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
        : "successbutnotfound",data:result.rows || []});
    console.log("resultsalonprofile", result.rows);
  } catch (err) {
    res.status(500).json({ success:false,error: err.message });
  }
};




exports.syncUser= async (req, res) => {
  try {
    const { name, mobile, address } = req.body;
    const uid = req.user.uid;
    const email = req.user.email;

    console.log("Syncing user:", { uid, email, name, mobile, address });

    // Check if user exists
    const existingUser = await pool.query(
      "SELECT * FROM usersmysalon WHERE uid = $1",
      [uid]
    );

    let result;
    if (existingUser.rows.length > 0) {
      // Update
      result = await pool.query(
        `UPDATE usersmysalon 
         SET name = $1, mobile = $2, address = $3, updated_at = NOW()
         WHERE uid = $4
         RETURNING *`,
        [name, mobile, address, uid]
      );
      console.log("User updated:", result.rows[0]);
    } else {
      // Insert
      result = await pool.query(
        `INSERT INTO usersmysalon (uid, email, name, mobile, address, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
         RETURNING *`,
        [uid, email, name, mobile, address]
      );
      console.log("User created:", result.rows[0]);
    }

    res.json({
      success: true,
      message: "User synced successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};


