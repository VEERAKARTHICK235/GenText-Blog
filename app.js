const express = require('express');
const cors = require('cors');
const axios = require('axios');
const admin = require("firebase-admin");
const serviceAccount = require("./firebase/serviceAccountKey.json");

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(cors());
app.use(express.json());

// Gemini API blog content generator
async function generateBlogContent(title) {
  const prompt = `Write a 5-sentence blog article on the topic: "${title}".`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    const response = await axios.post(GEMINI_API_URL, requestBody);
    const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    return content || "Content generation failed.";
  } catch (err) {
    console.error("Gemini API error:", err.message);
    return "Content generation failed.";
  }
}

// 📌 Create Blog (AI-generated content)
app.post('/blogs', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).send({ error: 'Title is required' });

    const content = await generateBlogContent(title);
    const newBlog = await db.collection('blogs').add({ title, content });

    res.status(201).send({ id: newBlog.id, title, content });
  } catch (error) {
    console.error("Blog creation failed:", error.message);
    res.status(500).send({ error: 'Failed to create blog' });
  }
});

// 📥 Get All Blogs
app.get('/blogs', async (req, res) => {
  try {
    const snapshot = await db.collection('blogs').get();
    const blogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.send(blogs);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch blogs' });
  }
});

// ✏️ Update Blog
app.put('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('blogs').doc(id).update(req.body);
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: 'Failed to update blog' });
  }
});

// 🗑️ Delete Blog
app.delete('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('blogs').doc(id).delete();
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete blog' });
  }
});

// 🔊 Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
