import React, { useEffect, useState } from 'react';
import { auth, provide, facebookProvider } from './firebase'; // Import both Google and Facebook providers
import { signInWithPopup } from 'firebase/auth';
import Airtable from 'airtable'; // Import Airtable
import './register.css';

const base = new Airtable({apiKey:'pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061'}).base('appfQNmAs6vTN5iAn');

export default function Register() {
    const [value, setValue] = useState('');
    const [name, setName] = useState(''); 
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [message, setMessage] = useState(''); 

    const handleGoogleSignIn = (e) => {
        e.preventDefault();
        signInWithPopup(auth, provide)
            .then((data) => {
                const userEmail = data.user.email;
                setValue(userEmail);
                if (isSigningUp) {
                    checkIfEmailExists(userEmail, name);
                } else {
                    checkUserInAirtable(userEmail);
                }
            })
            .catch((error) => {
                console.error('Error signing in with Google:', error);
            });
    };

    // Facebook Sign-In
    const handleFacebookSignIn = (e) => {
        e.preventDefault();
        signInWithPopup(auth, facebookProvider)
            .then((data) => {
                const userEmail = data.user.email;
                setValue(userEmail);
                if (isSigningUp) {
                    checkIfEmailExists(userEmail, name);
                } else {
                    checkUserInAirtable(userEmail);
                }
            })
            .catch((error) => {
                console.error('Error signing in with Facebook:', error);
            });
    };

    // Toggle between sign-up and sign-in
    const toggleSignUp = () => {
        setIsSigningUp((prev) => !prev);
        setMessage(''); // Clear any messages when toggling
    };

    const checkIfEmailExists = (email, name) => {
        base('sign')
            .select({
                filterByFormula: `{email} = '${email}'`, // Filter by email
            })
            .firstPage((err, records) => {
                if (err) {
                    console.error('Error checking email in Airtable:', err);
                    setMessage('Error checking your account. Please try again.');
                    return;
                }
                if (records.length > 0) {
                    // Email already exists, prompt user to sign in
                    setMessage('Email already registered. Please sign in.');
                } else {
                    // If email doesn't exist, proceed to sign up
                    saveUserToAirtable(email, name);
                }
            });
    };

    const saveUserToAirtable = (email, name) => {
        if (!name.trim()) {
            setMessage('Please enter your name.');
            return;
        }
        base('sign').create(
            [
                {
                    fields: {
                        email: email,
                        name: name, // Save the name to Airtable
                    },
                },
            ],
            (err, records) => {
                if (err) {
                    console.error('Error saving to Airtable:', err);
                    setMessage('Error saving your data. Please try again.');
                    return;
                }
                setMessage('You have successfully signed up!');
                localStorage.setItem('email', email); // Store email in localStorage
                localStorage.setItem('name', name);   // Store name in localStorage
                window.location.href = '/'; // Redirect after successful sign-up
            }
        );
    };

    const checkUserInAirtable = (email) => {
        base('sign')
            .select({
                filterByFormula: `{email} = '${email}'`, // Filter by email
            })
            .firstPage((err, records) => {
                if (err) {
                    console.error('Error fetching from Airtable:', err);
                    setMessage('Error checking your account. Please try again.');
                    return;
                }
                if (records.length > 0) {
                    const record = records[0];
                    const userName = record.fields.name; // Get the user's name from Airtable
                    console.log('User found, signing in...');
                    
                    localStorage.setItem('email', email); // Store email in localStorage
                    localStorage.setItem('name', userName); 
                    alert(`Welcome back, ${userName}!`);
    
                    window.location.href = '/'; // Redirect after successful sign-in
                } else {
                    setMessage('Email not registered. Please sign up first.');
                }
            });
    };

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setValue(storedEmail);
        }
    }, []);

    return (
        <div className="register-container">
            <form className="register-form">
                <h2>{isSigningUp ? 'Sign Up' : 'Sign In'}</h2>
                {isSigningUp && (
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                )}
                {!isSigningUp && (
                    <input type="text" name="userid" placeholder="Enter UserId" />
                )}
                {!isSigningUp && (
                    <input type="password" name="password" placeholder="Enter Password" />
                )}
                <button className="google-btn" onClick={handleGoogleSignIn}>
                    {isSigningUp ? 'Sign Up With Google' : 'Sign In With Google'}
                </button>
            </form>

            <div className="social-login">
                <h4>Or sign in with:</h4>
                <div className="social-icons">
                    <a href="#" className="social-icon google" onClick={handleGoogleSignIn}>
                        <ion-icon name="logo-google"></ion-icon>
                    </a>
                    <a href="#" className="social-icon facebook" onClick={handleFacebookSignIn}>
                        <ion-icon name="logo-facebook"></ion-icon>
                    </a>
                </div>
            </div>

            <p>
                {isSigningUp ? 'Already have an account?' : 'Don’t have an account?'}
                <button className="toggle-btn" onClick={toggleSignUp}>
                    {isSigningUp ? 'Sign In' : 'Sign Up'}
                </button>
            </p>

            {message && <p className="message">{message}</p>}
        </div>
    );
}
