import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './home.css';
import ima from './heroimage.jpg';
import ima1 from './images.jpeg';
import Airtable from 'airtable'; // Import Airtable
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Home() {
    const navigate = useNavigate();
    const [showpr, setShowPr] = useState(false);
    const [userEmail, setUserEmail] = useState(''); 
    const [credits, setCredits] = useState(0);
    const [name, setUsername] = useState('');
    const [rating, setRating] = useState(''); // State for selected rating

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        const storedName = localStorage.getItem('name');
        if (storedEmail) {
            setUserEmail(storedEmail); 
        } 
        if (storedName) {
            setUsername(storedName); 
        }
    }, []);

    const handleRegi = () => {
        navigate(`/register`);
    }

    const handleProfileMenuToggle = () => {
        setShowPr(!showpr); 
    }

    const closeProfileMenu = () => {
        setShowPr(false); 
    }
    const handleLogout = () => {
        localStorage.removeItem('email');
        localStorage.removeItem('name'); 
        setUserEmail('');
        setUsername(''); 
        setShowPr(false); 
    };
    

    function CustomLink({ href, children }) {
        const path = window.location.pathname;
        return (
            <li className={path === href ? "active" : ""}>
                <Link to={href}>{children}</Link>
            </li>
        );
    }

    const images = [ima, ima1];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [index]);

    const base = new Airtable({ apiKey: 'pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061' }).base('appfQNmAs6vTN5iAn'); 

    const handleSuggestionSubmit = (e) => {
        e.preventDefault();
        
        const suggestionField = e.target['suggestions']; 
        const suggestion = suggestionField ? suggestionField.value : ''; // Check if it exists, then get its value
        const date = new Date().toLocaleDateString();
    
        // Check if user is signed in by verifying name and userEmail
        if (!name || !userEmail) {
            alert("Please sign in to submit a suggestion.");
            // Optionally, you can call a signIn function here if you have one
            // signIn();
            return;
        }
        
        // Check if suggestion is provided
        if (!suggestion) {
            alert("Please fill out all fields before submitting your suggestion.");
            return;
        }
        
        // All conditions are met, proceed with submitting suggestion to Airtable
        base('suggestions').create([{
            "fields": {
                "name": name,
                "user": userEmail,
                "suggestion": suggestion,
            }
        }], (err) => {
            if (err) {
                console.error('Error submitting suggestion:', err);
                return;
            }
            alert('Suggestion submitted successfully!');
            e.target.reset(); // Reset form after submission
        });
    };
    
    const handleRatingSubmit = (e) => {
        e.preventDefault();
    
        if (!name || !userEmail || !rating) {
            alert("Please fill out all fields before submitting your rating.");
            return;
        }
    
        // Check if a rating already exists for this user
        base('rating').select({
            filterByFormula: `AND({name} = '${name}', {user} = '${userEmail}')`
        }).firstPage((err, records) => {
            if (err) {
                console.error('Error checking existing rating:', err);
                return;
            }
    
            if (records && records.length > 0) {
                // Rating already exists
                alert("You have already submitted a rating. You cannot submit again.");
            } else {
                // No existing rating, proceed to submit the new rating
                base('rating').create([{
                    "fields": {
                        "name": name,
                        "user": userEmail,
                        "rating": rating // Include only writable fields
                    }
                }], (err) => {
                    if (err) {
                        console.error('Error submitting rating:', err);
                        return;
                    }
                    alert('Rating submitted successfully!');
                    setRating(''); // Reset rating after submission
                });
            }
        });
    };
    
    const apiKey = 'pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061';
    const apiurl = `https://api.airtable.com/v0/appfQNmAs6vTN5iAn/sign`;

  const [winners, setWinners] = useState([]);
  useEffect(() => {
    const fetchWinners = async () => {
      if (!userEmail) return; // Skip fetch if userEmail is not available
  
      try {
        const response = await fetch(apiurl, {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        });
        const data = await response.json();
  
        if (data.records && data.records.length > 0) {
          setWinners(data.records); // Store all winners' data
  
          // Find logged-in user's credits
          const loggedInUser = data.records.find(
            (record) => record.fields.email === userEmail
            
          );
  
          setCredits(loggedInUser?.fields.credit || 0); // Update credits or default to 0
          
        } else {
          setCredits(0); // Default to 0 if no records found
        }
      } catch (error) {
        console.error('Error fetching winners:', error);
        setCredits(0); // Set default value on error
      }
    };
  
    fetchWinners();
  }, [userEmail]);
  
    return (
        <>
<div id="sr">
    <a href="#suggestions">
        <span class="suggestions-text">Give Suggestions</span>
        <i class="fas fa-comment-dots suggestions-icon"></i>
    </a>
</div>
<div id="sra">
    <a href="#rating">
        <span class="ratings-text">Rate Us</span>
        <i class="fas fa-star rating-icon"></i>
    </a>
</div>



  
            <div id='userprofile'>
                {userEmail ? (
                    <>
                        <ol id='udeatils'>
                            <li>Signed in as: {name}</li>
                            <li>Your Credits: {credits} <i className='fas fa-gem diamond-animation' id='gem'></i></li>


                        </ol>
                        <button id='profile' onClick={handleProfileMenuToggle}>&#128100;</button>
                    </>
                ) : (
                    <ol id='cred' onClick={handleRegi}>
                        <li><button id='sig'>Sign In</button></li>
                        <li><button id='sig'>Sign Up</button></li>
                    </ol>
                )}

                {showpr && userEmail && (
                    <>
                    <div id="profile-menu">
                        <span id="close-profile" onClick={closeProfileMenu}>&#x00D7;</span>
                        <ol>
                            <CustomLink href='/profile'>Your Profile</CustomLink>
                            <CustomLink href='/earning'>Your Earnings</CustomLink>
                            <CustomLink href='/dashboard'>Dashboard</CustomLink>
                            <CustomLink href='/history'>History</CustomLink>
                            <CustomLink href='/settings'>Settings</CustomLink>
                            <h5 id='logout' onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</h5>
                        </ol>
                    </div>
                    </> )}
            </div>
            <section style={{ textAlign: 'center', padding: '20px' }}>
                <div>
                    <img 
                        src={images[index]} 
                        alt="Description of the image" 
                        style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} 
                    />
                </div>
                {userEmail ? (
                    <h1>Hi! {name}</h1>
                ) : (
                    <div id='home-hero'>
                        <h2>
                            Register Now For Future!&nbsp;
                            <span id='sign' onClick={handleRegi}>Sign Up</span>
                        </h2>
                    </div>
                )}
            </section>
            <section id='inno'>
                <div id='inno-content'>
                    <h1>Our Innovation: SWASTHIK</h1>
                    <p>
                        At SWASTHIK, we are dedicated to addressing and solving social issues affecting our communities. Our mission is to empower individuals and organizations by providing innovative solutions that create a long-lasting impact.
                    </p>
                </div>
                <div id='inno-focus'>
                    <h1>Our Focus Areas</h1>
                    <ul>
                        <li>
                            <strong>Environment:</strong> 
                            We promote sustainable practices that enhance environmental health, encouraging communities to adopt eco-friendly solutions that preserve natural resources and improve quality of life.
                        </li>
                        <li>
                            <strong>Health & Wealth:</strong> 
                            We provide access to health education and financial literacy, equipping underprivileged youth with the knowledge and resources needed to build healthier and wealthier futures.
                        </li>
                        <li>
                            <strong>Food Wastage:</strong> 
                            We raise awareness about the importance of food conservation and redistribution, ensuring that surplus food is redirected to those in need while promoting sustainable consumption.
                        </li>
                        <li>
                            <strong>Natural Disasters:</strong> 
                            We advocate for resilient communities by providing resources and support to marginalized groups, ensuring that everyone has access to necessary aid during crises.
                        </li>
                    </ul>
                </div>
                <div id='inno-help'>
                    <h1>How You Can Help</h1>
                    <p>Your involvement can make a difference! Here are a few ways you can contribute:</p>
                    <ul>
                        <li>
                            <strong>Volunteer:</strong> 
                            Join our community outreach programs and help us raise awareness about our initiatives and their impact.
                        </li>
                        <li>
                            <strong>Donate:</strong> 
                            Your contributions can provide essential resources and support for our ongoing projects and outreach efforts.
                        </li>
                        <li>
                            <strong>Spread the Word:</strong> 
                            Share our mission and programs with your network, helping us reach more individuals who can benefit from our initiatives.
                        </li>
                    </ul>
                </div>
            </section>
            <section id='suggestions' className="feedback-section">
                <div className="feedback-container">
                    <h2>We Value Your Suggestions</h2>
                    <p>Your feedback helps us improve and create a greener future. Please share your thoughts below:</p>
                    <form className="feedback-form" onSubmit={handleSuggestionSubmit}>
                        <label htmlFor="suggestion-textarea" className="feedback-label">Your Suggestions:</label>
                        <textarea id="suggestion-textarea" name="suggestions" required></textarea>
                        <button type="submit" className="feedback-submit">Submit</button>
                    </form>
                </div>
            </section>
            <section id='rating' className="feedback-section">
                <div className="feedback-container">
                    <h2>Rate Us</h2>
                    <form className="feedback-form" onSubmit={handleRatingSubmit}>
                        <label htmlFor="rating-select" className="feedback-label">Your Rating:</label>
                        <select 
                            id="rating-select" 
                            value={rating} 
                            onChange={(e) => setRating(e.target.value)} 
                            required
                        >
                            <option value="" disabled>Select your rating</option>
                           <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                <option value="4">⭐⭐⭐⭐ Very Good</option>
                <option value="3">⭐⭐⭐ Good</option>
                <option value="2">⭐⭐ Needs Improvement</option>
                <option value="1">⭐ Poor</option>
                        </select>
                        <button type="submit" className="feedback-submit">Submit Rating</button>
                    </form>
                </div>
            </section>
        </>
    );
}
