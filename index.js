

// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const admin = require("firebase-admin");

// const salonRoutes = require("./MySalon/routes");
// const serviceAccount = require("./serviceAccountKey.json");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // 🔑 Firebase init
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

// // ✅ Routes
// app.use("/api", salonRoutes);

// // Start Server
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
// });



require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const http = require("http"); 
const { Server } = require("socket.io");
const { Pool } = require("pg");

const salonRoutes = require("./MySalon/routes");
const serviceAccount = require("./serviceAccountKey.json");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Firebase init
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// ✅ PostgreSQL config
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
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

// 🔥 Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ✅ Socket Events
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // 📩 Handle incoming message
  socket.on("sendMessage", async (data) => {
    console.log("📩 New Message:", data);

    try {
      // Save message in PostgreSQL
      const result = await pool.query(
        `INSERT INTO messages (email, text, created_at)
         VALUES ($1, $2, NOW())
         RETURNING *`,
        [data.email, data.text]
      );

      const savedMessage = result.rows[0];

      // Broadcast to all clients
      io.emit("receiveMessage", savedMessage);

    } catch (err) {
      console.error("❌ DB Error while saving message:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// ✅ Start Server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server + Socket.IO running at http://0.0.0.0:${PORT}`);
});
