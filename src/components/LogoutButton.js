import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function LogoutButton() {
  const handleLogout = () => {
    signOut(auth);
  };

  return <button onClick={handleLogout}>🚪 Logout</button>;
}

export default LogoutButton;
