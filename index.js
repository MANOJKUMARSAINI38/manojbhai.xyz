


// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const { Pool } = require("pg");
// const jwt = require("jsonwebtoken");
// const path = require("path");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // PostgreSQL config (अब .env से values ले रहे हैं)
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// console.log("Loaded DB Config:", {
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });


// // Static folders
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/vedios", express.static(path.join(__dirname, "vedios")));

// // Middleware
// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
// app.use(bodyParser.json());

// /**
//  * 🔹 Middleware to verify JWT
//  */
// function verifyToken(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   if (!authHeader) {
//     return res
//       .status(403)
//       .json({ success: false, message: "Token missing" });
//   }

//   const token = authHeader.split(" ")[1];
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Unauthorized or expired token" });
//     }
//     req.user = decoded;
//     next();
//   });
// }

// // ✅ API to insert form data (Signup)
// app.post("/api/form", async (req, res) => {
//   const { name, email, mobile, password } = req.body;

//   console.log("req.body", req.body);

//   try {
//     const result = await pool.query(
//       "INSERT INTO form (name, email, mobile, password) VALUES ($1, $2, $3, $4) RETURNING *",
//       [name, email, mobile, password]
//     );

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error("Database error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });


// app.post("/api/formBusiness", async (req, res) => {
//   const { name, email, mobile, password } = req.body;

//   console.log("req.body", req.body);

//   try {
//     const result = await pool.query(
//       "INSERT INTO salon_profile (name, email, mobile, password) VALUES ($1, $2, $3, $4) RETURNING *",
//       [name, email, mobile, password]
//     );

//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error("Database error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Login API with JWT
// app.post("/api/login", async (req, res) => {
//   const { email, password } = req.body;

//   console.log("login", req.body);

//   try {
//     const result = await pool.query(
//       "SELECT * FROM form WHERE email = $1 AND password = $2",
//       [email, password]
//     );

//     if (result.rows.length > 0) {
//       const user = result.rows[0];

//       // JWT Payload
//       const payload = { id: user.id, email: user.email , salonid: user.salonid};

//       // Token Generate
//       const token = jwt.sign(payload, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES,
//       });

//       res.json({
//         success: true,
//         message: "Login Successful",
//         token,
//         user: { id: user.id, email: user.email ,salonid: user.salonid},
//       });
//     } else {
//       res
//         .status(401)
//         .json({ success: false, message: "Invalid email or password" });
//     }
//   } catch (err) {
//     console.error("Database error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });


// app.post("/api/loginBusiness", async (req, res) => {
//   const { email, password } = req.body;

//   console.log("login", req.body);

//   try {
//     const result = await pool.query(
//       "SELECT * FROM salon_profile WHERE email = $1 AND password = $2",
//       [email, password]
//     );

//     if (result.rows.length > 0) {
//       const user = result.rows[0];

//       // JWT Payload
//       const payload = { id: user.id, email: user.email , salonid: user.salonid};

//       // Token Generate
//       const token = jwt.sign(payload, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES,
//       });

//       res.json({
//         success: true,
//         message: "Login Successful",
//         token,
//         user: { id: user.id, email: user.email ,salonid: user.salonid},
//       });
//     } else {
//       res
//         .status(401)
//         .json({ success: false, message: "Invalid email or password" });
//     }
//   } catch (err) {
//     console.error("Database error:", err.message);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // ✅ Public API (Salon List)
// app.get("/api/salon", async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM public."salon_profile"');
//     res.status(200).json(result.rows);
//   } catch (error) {
//     console.error("Database error", error.message);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // ✅ Protected Appointment API
// app.post("/api/appointments", verifyToken, async (req, res) => {
//   const { id, date, time } = req.body;

//   console.log("📩 Appointment Request:", req.body);
//   console.log("User from token:", req.user);
 

//   if (!id || !date || !time) {
//     return res.status(400).json({
//       success: false,
//       message: "Missing required fields (id, date, time)",
//     });
//   }

//   try {
//     const email = req.user.email;
//     const result = await pool.query(
//       'INSERT INTO public."appointments" (salonid, date, time,name) VALUES ($1, $2, $3,$4) RETURNING *',
//       [id, date, time,email]
//     );

//     res.status(201).json({
//       success: true,
//       message: "Appointment booked successfully ✅",
//       appointment: result.rows[0],
//     });
//   } catch (error) {
//     console.error(" Database error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// });

// // ✅ Protected Orders API
// app.get("/api/orders", verifyToken, async (req, res) => {
//   try {
//     const salonid = req.user.id; 
//    console.log("Decoded User:", req.user);
//     const result = await pool.query(
//       'SELECT * FROM public."appointments" WHERE salonid = $1',
//       [salonid]
//     );
//     console.log("result",result.rows)
//     res.status(200).json({ success: true, result: result.rows });
//   } catch (error) {
//     console.error("error in getting list", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // Start server
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server running at http://0.0.0.0:${PORT}`);
// });


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const admin = require("firebase-admin");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// 🔑 PostgreSQL config
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// 🔑 Firebase Admin init
const serviceAccount = require("./serviceAccountKey.json"); // Firebase service account JSON
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

// Middleware to verify Firebase Token
async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ error: "Token missing" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // { uid, email, name, etc. }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid Firebase token" });
  }
}

// ✅ Sync Firebase user data with PostgreSQL
app.post("/api/syncUser", verifyFirebaseToken, async (req, res) => {
  const { mobile, address } = req.body;
  const { uid, email } = req.user;

  try {
    await pool.query(
      `INSERT INTO users (uid, email, mobile, address)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (uid) DO UPDATE 
       SET mobile = EXCLUDED.mobile, address = EXCLUDED.address`,
      [uid, email, mobile, address]
    );

    res.json({ success: true, message: "User synced with DB ✅" });
  } catch (err) {
    console.error("DB Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Example: Protected API
app.get("/api/profile", verifyFirebaseToken, async (req, res) => {
  const { uid } = req.user;
  try {
    const result = await pool.query(`SELECT * FROM users WHERE uid=$1`, [uid]);
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
});
