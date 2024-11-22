import React, { useEffect, useState } from 'react';
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './disasters.css';
import Disas from './disas';

export default function Disasters() {
  const [location, setLocation] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const storedName = localStorage.getItem('name');
  const storedEmail = localStorage.getItem('email');

  // Handle location input
  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!location || !file) {
      setMessage("Please fill in all fields.");
      return;
    }

    // File validation (image/video)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi'];
    if (!allowedTypes.includes(file.type)) {
      setMessage("Unsupported file type. Please upload an image or video.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("File is too large. Please upload a smaller file (max 5MB).");
      return;
    }

    setIsSubmitting(true);
    setMessage("Submitting...");

    try {
      // Step 1: Upload the file to Firebase Storage (image or video)
      const storageRef = ref(storage, `uploads/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(snapshot.ref);

      // Step 2: Submit the data to Airtable with the Firebase file URL
      const data = {
        fields: {
          name: storedName,
          email: storedEmail,
          location: location,
          file: [{ url: fileUrl }], // Airtable expects an array for attachment fields
        },
      };

      const response = await fetch('https://api.airtable.com/v0/appfQNmAs6vTN5iAn/disasters', {
        method: 'POST',
        headers: {
          Authorization: `Bearer pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061`, // Use environment variable for Airtable API key
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage("Data submitted successfully!");
        setLocation('');
        setFile(null);
      } else {
        const errorData = await response.json();
        setMessage("Failed to submit data.");
        console.error("Airtable Error:", errorData);
      }
    } catch (error) {
      if (error.message === "NetworkError when attempting to fetch resource.") {
        setMessage("Network connection lost. Please try again.");
      } else {
        setMessage("Error uploading file or submitting data.");
      }
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section id="nat-section">
        <div id="nat-cont">
          {message && <p>{message}</p>}
        </div>
      </section>

      <section id="natural-section">
        <div id="post-file">
          <textarea
            id="nat-add"
            cols="100"
            rows="3"
            value={location}
            onChange={handleLocationChange}
            placeholder="Enter Location"
          ></textarea>
          <br />
         <input
            type="file"
            name="natural"
            id="file-upload"
            accept="image/*,video/*"  // Accept both images and videos
            onChange={handleFileChange}
          />
          <br />

          <button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>

          {/* Preview based on file type */}
          {file && (
            file.type.startsWith('image/') ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                width="320"
                height="240"
              />
            ) : file.type.startsWith('video/') ? (
              <video width="320" height="240" controls>
                <source src={URL.createObjectURL(file)} type={file.type} />
                Your browser does not support the video tag.
              </video>
            ) : null
          )}
        </div>
      </section>
      <Disas/>
    </>
  );
}
