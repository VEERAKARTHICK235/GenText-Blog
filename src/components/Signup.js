import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from 'react-toastify';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success('🎉 Account created successfully');
    } catch (err) {
      toast.error('❌ Signup failed: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSignup} style={formStyle}>
      <h3 style={heading}>🆕 Sign Up</h3>
      <input
        style={input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        style={input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button style={button} type="submit">Sign Up</button>
    </form>
  );
}

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  marginBottom: '30px',
  alignItems: 'center',
};

const input = {
  width: '90%',
  maxWidth: '300px',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #ccc',
};

const button = {
  padding: '10px 20px',
  background: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const heading = {
  marginBottom: '10px',
};

export default Signup;
