import React from 'react';
import './health.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom'; // Correct import for useNavigate
import i1 from './images.png'
import i2 from './download.jpg';
import i3 from './hyper.jpg';
import i4 from './obe.jpg';
import i5 from './gut.jpg';
export default function Health() {
  const navigate = useNavigate();
  
  const handleParticipate = (challenge) => {
    navigate(`/${challenge}`);  
  };


  return (
    <>
      <div id="heal-tags">
        <h1>Participate In Health Challenges Now</h1>
        <ol>
          <li>
            <img src={i1} alt="Boosting Immunity" />
            <div className="contest-info">
              <h2>Immunity-Boosting Challenge</h2>
              <p>Take daily steps to strengthen your immune system through healthy habits like proper nutrition and exercise.</p>
            </div>
            <button onClick={() => handleParticipate('immunity')}>Participate</button>
          </li>

          <li>
            <img src={i2} alt="Managing Diabetes" />
            <div className="contest-info">
              <h2>Diabetes Management Program</h2>
              <p>Join our program to learn how to manage diabetes with diet, exercise, and monitoring techniques.</p>
            </div>
            <button onClick={() => handleParticipate('diabetes')}>Participate</button>
          </li>

          <li>
            <img src={i3} alt="Controlling Hypertension" />
            <div className="contest-info">
              <h2>Hypertension Control Challenge</h2>
              <p>Learn effective ways to control high blood pressure through lifestyle changes, diet, and stress management.</p>
            </div>
            <button onClick={() => handleParticipate('hyper')}>Participate</button>
          </li>

        </ol>
      </div>
    </>
  );
}
