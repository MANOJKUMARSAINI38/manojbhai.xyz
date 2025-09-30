// const admin = require("firebase-admin");

// async function verifyFirebaseToken(req, res, next) {
//   const authHeader = req.headers["authorization"];
//   if (!authHeader) return res.status(403).json({ error: "Token missing" });

//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = await admin.auth().verifyIdToken(token);
//     req.user = decoded; // { uid, email, etc. }
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid Firebase token" });
//   }
// }

// module.exports = { verifyFirebaseToken };


const admin = require("firebase-admin");

async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({
      success: false,
      message: "Token missing",
      data: null,
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded; // { uid, email, etc. }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid Firebase token",
      error: err.message,
      data: null,
    });
  }
}

module.exports = { verifyFirebaseToken };
