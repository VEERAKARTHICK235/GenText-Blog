const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');


router.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const user = await admin.auth().getUser(decoded.uid);
    res.json({ uid: user.uid, email: user.email });
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

module.exports = router;
