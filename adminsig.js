import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './adminsig.css';

export default function Adminsig() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(''); // Clear any previous error

    try {
      const airtableApiUrl = 'https://api.airtable.com/v0/appfQNmAs6vTN5iAn/admin';

      const response = await axios.get(airtableApiUrl, {
        headers: {
          'Authorization': `Bearer pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061`, // Use environment variable
          'Content-Type': 'application/json'
        }
      });

      const validAdmin = response.data.records.find(record => {
        const storedEmail = record.fields.email;
        const storedPassword = record.fields.pass;
        return storedEmail === email && storedPassword.trim() === password.trim();
      });

      if (validAdmin) {
        localStorage.setItem('isAdminLoggedIn', 'true');
        setEmail(''); // Clear email field
        setPassword(''); // Clear password field
        navigate(`/admin`);
      } else {
        setError("Invalid email or password.");
      }
    } catch (error) {
      setError("An error occurred while signing in.");
      console.error("Error during sign-in:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <section id='adsig'>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}> {/* Disable button while loading */}
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </section>
  );
}
