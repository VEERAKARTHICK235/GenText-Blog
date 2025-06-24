import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function CreateBlog() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.warn("⚠️ Please enter a blog title.");
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/blogs', { title }); // only send title
      toast.success('✅ Blog generated and posted!');
      setTitle('');
    } catch (err) {
      toast.error('❌ Failed to generate blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3 style={headerStyle}>🪄 AI-Powered Blog Generator</h3>
      <input
        type="text"
        placeholder="Enter blog title (e.g., Future of AI)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={inputStyle}
      />
      <button type="submit" style={buttonStyle} disabled={loading}>
        {loading ? 'Generating...' : '✨ Generate Blog'}
      </button>
    </form>
  );
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: 30,
  gap: 10,
};

const inputStyle = {
  width: '100%',
  maxWidth: 600,
  padding: '10px',
  fontSize: '16px',
  borderRadius: '6px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: 10,
};

export default CreateBlog;
