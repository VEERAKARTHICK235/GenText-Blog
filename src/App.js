import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './components/Login';
import Signup from './components/Signup';
import BlogList from './components/BlogList';
import CreateBlog from './components/CreateBlog';
import LogoutButton from './components/LogoutButton';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={appStyle}>
      <div style={contentBox}>
        <h1 style={{ textAlign: 'center' }}>🤖 GenText Blog</h1>
        {!user ? (
          <>
            <Login />
            <Signup />
          </>
        ) : (
          <>
            <LogoutButton />
            <CreateBlog />
            <BlogList />
          </>
        )}
      </div>
      <ToastContainer position="top-center" autoClose={3000} newestOnTop />
    </div>
  );
}

const appStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(to right, #f5f7fa, #c3cfe2)',
  padding: '20px',
};

const contentBox = {
  width: '100%',
  maxWidth: '800px',
  background: '#fff',
  padding: '30px',
  borderRadius: '12px',
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
};

export default App;
