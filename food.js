import React from 'react';
import './environment.css';
import { useNavigate } from 'react-router-dom';
import imag from './output-onlinepngtools.png';  // You can replace this with an image related to food wastage
import Envibuy from './envibuy';
import Food1 from './food1';
import Disasters from './disasters';
import './food.css';
import Foodloc from './foodloc';
export default function Food() {
  const navigate = useNavigate();

  const handleParticipate = (contest) => {
    navigate(`/contestf/${contest}`);
  };

  return (
    <>
      <Food1/>
      <section id='env'>
        <div className="hero-section">
          <div className="hero-content">
            <h1>Take Action Against Food Wastage!</h1>
            <p>Learn how you can reduce food waste and contribute to a sustainable future. Together, we can minimize waste, save resources, and make a positive impact on the environment.</p>
            <button className="cta-button" onClick={() => alert('Exploring Sustainable Food Practices!')}>
              Explore Sustainable Solutions
            </button>
          </div>
        </div>

        <main id="environment">
          <h1>Food Waste Awareness: Your Participation Counts!</h1>
          <h2>About the Contest</h2>
          <p>
            This contest invites you to join in the effort to reduce food wastage. Whether it's through reusing leftovers, donating surplus food, or spreading awareness, every action helps. Your participation plays a crucial role in making the world a better place for future generations.
          </p>
        </main>
      </section>

      <section id="contests">
        <div id="cont-tags">
          <h1>Participate in Food Wastage Activities Now</h1>
          <ol>
            <li>
              <img src={imag} alt="Food Donation" />
              <div className="contest-info">
                <h2>Donate Surplus Food</h2>
                <p>Help reduce food waste by donating surplus food to those in need. Your donations can make a big difference in the lives of many.</p>
              </div>
              <button onClick={() => handleParticipate('donate')}>Participate</button>
            </li>
            <li>
              <img src={imag} alt="Reusing Food" />
              <div className="contest-info">
                <h2>Reuse Leftovers</h2>
                <p>Join the effort to reuse leftovers creatively instead of throwing them away. Learn recipes and tips to transform food scraps into delicious meals!</p>
              </div>
              <button onClick={() => handleParticipate('reuse')}>Participate</button>
            </li>
            <li>
              <img src={imag} alt="Food Waste Awareness" />
              <div className="contest-info">
                <h2>Food Waste Awareness</h2>
                <p>Spread awareness about food wastage and its environmental impact. Educate others on how small changes in behavior can help reduce waste.</p>
              </div>
              <button onClick={() => handleParticipate('awareness')}>Participate</button>
            </li>
          </ol>
        </div>
      </section> 
<div id='d1'>
      <h2 id='fed'>Food Donation from Events</h2>
    <p id='fedp'>Send us the location when there is any event and inform us whether there is leftover food. We will collect and distribute this food to those in need, helping to reduce food waste and support the community.</p>

<Foodloc/>
</div>
      <Envibuy/>
    </>
  );
}
