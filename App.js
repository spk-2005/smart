
import './App.css';
import { useState, useEffect } from "react";
import User from "./user";

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    // Check local storage for admin login state
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  });

  // Update local storage whenever login state changes
  useEffect(() => {
    localStorage.setItem('isAdminLoggedIn', isAdminLoggedIn);
  }, [isAdminLoggedIn]);

  const handleLogout = () => {
    setIsAdminLoggedIn(false); // Update state
    localStorage.removeItem('isAdminLoggedIn'); // Clear local storage
  };

  const handleAdminSigNavigate = () => {
    // Reset the admin login state when navigating to Adminsig
    setIsAdminLoggedIn(false);
  };

  return (
    <>
    <div id='ap'>
    <User/></div>
    </>
    );
}

export default App;
