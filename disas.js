import React, { useEffect, useState } from 'react';
import './disas.css';

export default function Disas() {
  const apiKey = 'pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061';
  const apiurl = `https://api.airtable.com/v0/appfQNmAs6vTN5iAn/disasters`;

  const [disasters, setDisasters] = useState([]);

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const response = await fetch(apiurl, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
        const data = await response.json();

        // Assuming the data returned has a `records` array
        const sortedDisasters = data.records
          .map((record) => ({
            id: record.id,
            location: record.fields.location,
            name: record.fields.name,
            file: record.fields.file, // Assuming this contains an array of media
            date: record.fields.date,
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date (latest to earliest)

        setDisasters(sortedDisasters);
      } catch (error) {
        console.error('Error fetching disaster posts:', error);
      }
    };

    fetchDisasters();
  }, []);

  return (
    <>
      <section id="disas-section">
        <div id="disas-cont">
          <h1>Natural Disaster Alerts</h1>
          {disasters.length > 0 ? (
            disasters.map((disaster) => (
              <div key={disaster.id} className="disaster-post">
                <h2>{disaster.name}</h2>
                <p></p>
                <p>
                  <strong>Location:</strong> {disaster.location}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(disaster.date).toLocaleDateString()}
                </p>
                {disaster.file &&
                  disaster.file.map((media, index) => {
                    const fileType = media.type;
                    if (fileType.startsWith('video/')) {
                      return (
                        <div key={index}>
                          <h4>Alert Video</h4>
                          <video controls>
                            <source src={media.url} type={fileType} />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      );
                    } else if (fileType.startsWith('image/')) {
                      return (
                        <div key={index}>
                          <h4>Alert Photo</h4>
                          <img src={media.url} alt={`${disaster.name} media`} />
                        </div>
                      );
                    }
                    return null; // Skip unsupported file types
                  })}
              </div>
            ))
          ) : (
            <p>No disaster posts available at the moment.</p>
          )}
        </div>
      </section>
    </>
  );
}
