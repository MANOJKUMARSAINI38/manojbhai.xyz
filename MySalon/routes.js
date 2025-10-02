// const express = require("express");
// const router = express.Router();
// const { getSalons } = require("./controller");
// const { verifyFirebaseToken } = require("../index");

// // ✅ /api/salons
// router.get("/salons", verifyFirebaseToken, getSalons);

// module.exports = router;


const express = require("express");
const router = express.Router();
const { getSalons ,syncUser} = require("./controller");
const { verifyFirebaseToken } = require("../middleware/verifyMiddleware");

// ✅ /api/salons
router.get("/salons", verifyFirebaseToken, getSalons);

router.get("/syncUser", verifyFirebaseToken, syncUser);

module.exports = router;
