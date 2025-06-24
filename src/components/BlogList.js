import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/blogs');
      setBlogs(res.data);
    } catch (err) {
      toast.error('❌ Failed to fetch blogs');
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/blogs/${id}`);
      toast.success('🗑️ Blog deleted successfully!', {
        position: 'top-center',
        autoClose: 2000,
      });
      fetchBlogs();
    } catch (error) {
      toast.error('❌ Failed to delete blog');
    }
  };

  const handleEdit = (blog) => {
    setEditId(blog.id);
    setEditTitle(blog.title);
    setEditContent(blog.content);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/blogs/${editId}`, {
        title: editTitle,
        content: editContent,
      });
      toast.success('✏️ Blog updated!');
      setEditId(null);
      setEditTitle('');
      setEditContent('');
      fetchBlogs();
    } catch {
      toast.error('❌ Failed to update blog');
    }
  };

  return (
    <div>
      <h3>📁 All Blogs</h3>
      {blogs.map((blog) => (
        <div key={blog.id} style={blogStyle}>
          {editId === blog.id ? (
            <form onSubmit={handleUpdate}>
              <input
                style={inputStyle}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                style={textAreaStyle}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <button type="submit" style={buttonStyle}>Update</button>
            </form>
          ) : (
            <>
              <h4><strong>{blog.title}</strong></h4>
              <p>{blog.content}</p>
              <button onClick={() => handleEdit(blog)} style={editButtonStyle}>✏️ Edit</button>
              <button onClick={() => handleDelete(blog.id)} style={deleteButtonStyle}>🗑️ Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

// Styles
const blogStyle = {
  backgroundColor: '#f9f9f9',
  padding: '15px',
  borderRadius: '8px',
  marginBottom: '15px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  marginBottom: '10px',
};

const textAreaStyle = {
  ...inputStyle,
  resize: 'vertical',
};

const buttonStyle = {
  padding: '6px 12px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const editButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#007bff',
  marginRight: '10px',
};

const deleteButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#dc3545',
};

export default BlogList;
