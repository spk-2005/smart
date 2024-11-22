// Contact.js
import React from 'react';
import './contact.css';

export default function Contact() {
  return (
    <>
      <section className="contact-section">
        <div className="contact-container">
          <h1>Contact Us</h1>
          <table className="contact-table">
            <tbody>
              <tr>
                <td>Mobile:</td>
                <td><a href='tel:8309179509'>+91 8309179509</a></td>
              </tr>
              <tr>
                <td>Email:</td>
                <td><a href="mailto:prasannasimha5002@gmail.com">prasannasimha5002@gmail.com</a></td>
              </tr>
              <tr>
                <td>Instagram:</td>
                <td><a href="https://instagram.com/username" target="_blank" rel="noopener noreferrer">Click Here</a></td>
              </tr>
              <tr>
                <td>WhatsApp:</td>
                <td><a href="https://wa.me/8309179509" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="donors-section">
          <h2>For Donors</h2>
          <p>If you are interested in donating, please reach out to us.</p>
          <button className="contact-button">Contact for Donations</button>
        </div>

        <div className="sponsors-section">
          <h2>For Sponsors</h2>
          <p>We welcome sponsorship opportunities. Please get in touch to learn more.</p>
          <button className="contact-button">Contact for Sponsorship</button>
        </div>
      </section>
    </>
  );
}
