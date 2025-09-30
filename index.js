

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const { Pool } = require("pg");
// const admin = require("firebase-admin");
// const path = require("path");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // 🔑 PostgreSQL config
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// // module.exports.pool = pool; // controller me use karne ke liye

// // Routes
// const salonRoutes = require("./MySalon/routes");

// // 🔑 Firebase Admin init
// const serviceAccount = require("./serviceAccountKey.json"); // Firebase service account JSON
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// // Middleware
// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
// app.use(bodyParser.json());

// // Middleware to verify Firebase Token
// async function verifyFirebaseToken(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   if (!authHeader) return res.status(403).json({ error: "Token missing" });

//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = await admin.auth().verifyIdToken(token);
//     req.user = decoded; // { uid, email, name, etc. }
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid Firebase token" });
//   }
// }

// module.exports = { pool, admin, verifyFirebaseToken };

// // ✅ Sync Firebase user data with PostgreSQL
// app.post("/api/syncUser", verifyFirebaseToken, async (req, res) => {
//   const { mobile, address } = req.body;
//   const { uid, email } = req.user;

//   try {
//     await pool.query(
//       `INSERT INTO usersfirebase (uid, email, mobile, address)
//        VALUES ($1, $2, $3, $4)
//        ON CONFLICT (uid) DO UPDATE 
//        SET mobile = EXCLUDED.mobile, address = EXCLUDED.address`,
//       [uid, email, mobile, address]
//     );

//     res.json({ success: true, message: "User synced with DB ✅" });
//   } catch (err) {
//     console.error("DB Error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Example: Protected API
// app.get("/api/profile", verifyFirebaseToken, async (req, res) => {
//   const { uid } = req.user;
//   try {
//     const result = await pool.query(`SELECT * FROM users WHERE uid=$1`, [uid]);
//     res.json(result.rows[0] || {});
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// // app.get("/api/salons", verifyFirebaseToken, async (req, res) => {
// //   const { uid } = req.user;
// //   try {
// //     const result = await pool.query(`SELECT * FROM salon_profile `);
// //     res.json(result.rows || []);
// //     console.log("resultsalonprofile", result.rows);  
// // } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // });


// // ✅ Routes use karo
// app.use("/api", salonRoutes);

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
// });



require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

const salonRoutes = require("./MySalon/routes");
const serviceAccount = require("./serviceAccountKey.json");

const app = express();
const PORT = process.env.PORT || 5000;

// 🔑 Firebase init
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

// ✅ Routes
app.use("/api", salonRoutes);

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});
