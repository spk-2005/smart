import React, { useState, useEffect } from 'react';
import './food1.css';

export default function Food1() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [message, setMessage] = useState('');
  const [suggestionsList, setSuggestionsList] = useState([]); // State to store fetched suggestions

  const storedName = localStorage.getItem('name');
  const storedEmail = localStorage.getItem('email');

  const handleSubmit = async () => {
    if (!suggestion) {
      setMessage("Please fill in all fields.");
      return;
    }

    const data = {
      fields: {
        name: storedName,
        email: storedEmail,
        suggestion: suggestion,
      },
    };

    try {
      const response = await fetch('https://api.airtable.com/v0/appfQNmAs6vTN5iAn/food1', {
        method: 'POST',
        headers: {
          Authorization: `Bearer pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage("Suggestion submitted successfully!");
        setSuggestion('');
        fetchSuggestions(); // Fetch suggestions again to update the list
      } else {
        setMessage("Failed to submit suggestion.");
      }
    } catch (error) {
      setMessage("Error submitting suggestion.");
    }
  };

  // Fetch existing suggestions from Airtable
  const fetchSuggestions = async () => {
    try {
      const response = await fetch('https://api.airtable.com/v0/appfQNmAs6vTN5iAn/food1', {
        method: 'GET',
        headers: {
          Authorization: `Bearer pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061`,
        },
      });
      const data = await response.json();
      const suggestions = data.records.map(record => ({
        id: record.id,
        ...record.fields,
        time: new Date(record.createdTime), // Store Date object for easy formatting
      }));
      setSuggestionsList(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return (
    <>
      <section id="food1">
        <div id="food1-cont">
          <h2>Post Your Suggestions to Prevent Food Waste</h2>
          <div id="sug">
            <textarea
              placeholder="Your Suggestion"
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
            ></textarea>
            <button onClick={handleSubmit}>Post</button>
            {message && <p>{message}</p>}
          </div>
        </div>
      </section>
      
      <section id='sug-al'>
        <h3>Community Suggestions</h3>
        <div>
          {suggestionsList.length > 0 ? (
            suggestionsList.map((item) => (
              <div key={item.id} className="suggestion-item">
                <p id='cname'><strong>{item.name}</strong></p>
                <p id='sugee'>{item.suggestion}</p>
                <p>{item.time.toLocaleString("en-US", { 
                    month: 'numeric', day: 'numeric', year: 'numeric', 
                    hour: 'numeric', minute: 'numeric', hour12: true 
                  })}</p>
              </div>
            ))
          ) : (
            <p>No suggestions available yet.</p>
          )}
        </div>
      </section>
    </>
  );
}
