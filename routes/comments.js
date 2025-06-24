const express = require('express');
const router = express.Router();
const { db } = require('../firebase/firebaseConfig');
const verifyToken = require('../middlewares/verifyToken');

// Add comment to blog
router.post('/:blogId', verifyToken, async (req, res) => {
  const { text } = req.body;
  const newComment = {
    text,
    userId: req.user.uid,
    blogId: req.params.blogId,
    createdAt: new Date()
  };
  const docRef = await db.collection('comments').add(newComment);
  res.json({ id: docRef.id, ...newComment });
});

// Get all comments for a blog
router.get('/:blogId', async (req, res) => {
  const snapshot = await db.collection('comments')
    .where('blogId', '==', req.params.blogId)
    .orderBy('createdAt', 'asc')
    .get();

  const comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(comments);
});

module.exports = router;
