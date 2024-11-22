import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Adminport() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn'); // Clear login status
    navigate('/adminsig'); // Redirect to the admin sign-in page
  };

  return (
    <>
      <section>
        <div>
          <customLink>Users</customLink>
          <customLink>Winners</customLink>
        </div>
      </section>
    </>
  );
}
