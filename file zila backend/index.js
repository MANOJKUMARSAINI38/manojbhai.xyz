const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");




const app = express();
const PORT = 5000;

// PostgreSQL config
const pool = new Pool({
  user: "manoj",
  host: "localhost",
  database: "postgres",
  password: "Manojkumarsaini@123",
  port: 5432,
});


const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/vedios", express.static(path.join(__dirname, "vedios")));
// Middleware

//origin: "https://www.manojbhai.xyz",
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(bodyParser.json());

// ✅ API to insert form data
app.post("/api/form", async (req, res) => {
  const { name, email,mobile,password } = req.body;

  console.log("req.body",req.body)

  try {
    const result = await pool.query(
      "INSERT INTO form (name, email,mobile,password) VALUES ($1, $2,$3,$4) RETURNING *",
      [name, email,mobile,password]
    );

    console.log("result",result)
    res.json(result.rows[0]); // inserted row return करो
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Login API
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("login",req.body)

  try {
    const result = await pool.query(
      "SELECT * FROM form WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, message: "Login Successful", user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/salon',async(req,res)=>{

   console.log(" Incoming request on /api/salon");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Headers:", req.headers);
  try{
    const result=await pool.query(
      'SELECT * FROM public."salon_profile"'

    )
   res.status(200).json(result.rows)
  }catch(error){
        console.error("databse error",error.message)
        res.status(500).json({success:false,error:error.message})
  }
})


app.post('/api/appointments',async(req,res)=>{
  const {salonId,date,time}=req.body
  try{
    const result=await pool.query(
      'INSERT INTO Public.appointments (salonId,date,time) VALUES ($1 ,$2 ,$3) RETURNING *',
      [salonId,date,time]
    )
    res.status(201).json({success:true,result:result.rows[0]})

  }catch(error){
    console.log("database error",error)
    res.status(500).json({success:false,error:error.message})
  }
})


// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
