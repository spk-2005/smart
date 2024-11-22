import React, { useEffect, useState } from 'react';
import './profile.css';
export default function Profile() {
  const apiKey = 'pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061';
  const apiurl = `https://api.airtable.com/v0/appfQNmAs6vTN5iAn/sign`;

  const [profile, setProfile] = useState(null);

  // Retrieve stored name and email from localStorage
  const storedEmail = localStorage.getItem('email');
  const storedName = localStorage.getItem('name');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(apiurl, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
        const data = await response.json();

        // Find the profile that matches the stored name and email
        const matchedProfile = data.records.find(
          (record) =>
            record.fields.name === storedName && record.fields.email === storedEmail
        );

        // If a match is found, set the profile data
        if (matchedProfile) {
          setProfile({
            id: matchedProfile.id,
            name: matchedProfile.fields.name || 'N/A',
            email: matchedProfile.fields.email || 'N/A',
            credit: matchedProfile.fields.credit || 'N/A',
            photo:
              matchedProfile.fields.photo && matchedProfile.fields.photo[0]
                ? matchedProfile.fields.photo[0].url
                : null,
          });
        } else {
          setProfile(null); // No matching profile
        }
      } catch (error) {
        console.error('Error fetching profile posts:', error);
      }
    };

    fetchProfile();
  }, [storedName, storedEmail]);

  return (
    <section id="profile-section">
      <div id="profile-cont">
        <h2>Profile Details</h2>
        {profile ? (
          <div>
            {profile.photo && (
              <img
                src={profile.photo}
                alt={`${profile.name}'s photo`}
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  marginBottom: '20px',
                }}
              />
            )}
            <ol>
              <li>Your Name: {profile.name}</li>
              <li>Your Email: {profile.email}</li>
              <li>Your Credits: {profile.credit}</li>
            </ol>
          </div>
        ) : (
          <p>No profile found for the stored name and email.</p>
        )}
      </div>
    </section>
  );
}
