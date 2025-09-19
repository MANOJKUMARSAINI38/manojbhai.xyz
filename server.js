const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = 5000;

// Enable CORS + JSON parsing
app.use(cors());
app.use(express.json());

// ✅ PostgreSQL connection pool बनाओ
const pool = new Pool({
  user: "postgres",        // 👉 अपना DB username डालो
  host: "localhost",
  database: "postgres",        // 👉 अपना DB name डालो
  password: "root",  // 👉 अपना password डालो
  port: 5432,
});

// ✅ API to insert form data
app.post("/api/form", async (req, res) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO form (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.json(result.rows[0]); // inserted row return करो
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
