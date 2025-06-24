const express = require('express');
const router = express.Router();
const { db } = require('../firebase/firebaseConfig');
const verifyToken = require('../middlewares/verifyToken');

// Create blog
router.post('/', verifyToken, async (req, res) => {
  const { title, content } = req.body;
  const newBlog = {
    title,
    content,
    userId: req.user.uid,
    createdAt: new Date()
  };
  const docRef = await db.collection('blogs').add(newBlog);
  res.json({ id: docRef.id, ...newBlog });
});

// Get all blogs
router.get('/', async (req, res) => {
  const snapshot = await db.collection('blogs').orderBy('createdAt', 'desc').get();
  const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(blogs);
});

// Get blog by ID
router.get('/:id', async (req, res) => {
  const doc = await db.collection('blogs').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ message: 'Not found' });
  res.json({ id: doc.id, ...doc.data() });
});

module.exports = router;
