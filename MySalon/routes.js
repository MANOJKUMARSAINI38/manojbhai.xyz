const express = require("express");
const router = express.Router();
const { getSalons } = require("./controller");
const { verifyFirebaseToken } = require("../index");

// ✅ /api/salons
router.get("/salons", verifyFirebaseToken, getSalons);

module.exports = router;
