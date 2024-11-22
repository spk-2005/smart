import React from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';

export default function Admin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn'); // Clear login status
    navigate('/adminsig'); // Redirect to the admin sign-in page
  };

  return (
    <>
      <section className="admin-section">
        <div id="admin-container">
          <h1>Welcome to the Admin Dashboard</h1>
          <p className="admin-intro">
            As an admin, you have access to manage users, view reports, and configure system settings.
            Please use the navigation menu to explore the different sections of the admin panel.
          </p>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </section>
    </>
  );
}
