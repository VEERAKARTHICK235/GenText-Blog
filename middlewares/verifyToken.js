const admin = require("firebase-admin");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Unauthorized" });
  }
};

module.exports = verifyToken;
