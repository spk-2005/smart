import React from 'react';
import './environment.css';
import maingif from './km_20240925_720p_60f_20240929_215844.mp4';
import { useNavigate } from 'react-router-dom';
import imag from './output-onlinepngtools.png'
import Envibuy from './envibuy';
export default function Environment() {
  const navigate=useNavigate();
  const handleParticipate = (contest) => {
    navigate(`/contest/${contest}`);
  };

  return (
    <>
      <section id='env'>
        <div className="hero-section">
          <video 
            src={maingif} 
            autoPlay 
            muted 
            loop 
            className="hero-video"
            aria-label="A visually appealing video promoting environmental sustainability"
          />
          <div className="hero-content">
            <h1>Make Your Digital Footprint Greener!</h1>
            <p>
              Join the movement towards a more sustainable and profitable future. 
              Discover eco-friendly solutions that not only protect the planet but also boost your business growth.
            </p>
            <button className="cta-button" onClick={() => alert('Exploring Sustainable Solutions!')}>
              Explore Sustainable Solutions
            </button>
          </div>
        </div>

        <main id="environment">
          <h1>For a Great Environment, Your Participation Matters!</h1>
          <h2>About the Contest</h2>
          <p>
            This contest aims to engage you in environmental conservation while offering an entertaining activity. 
            Be active, participate, and contribute to our society, not only for ourselves but for future generations.
          </p>
        </main>
      </section>
      <section id="contests">
  <div id="cont-tags">
    <h1>Participate In Contest Now</h1>
    <ol>
      <li>
        <img src={imag} alt="Planting Trees" />
        <div className="contest-info">
          <h2>Planting Trees</h2>
          <p>Help us plant trees to make the planet greener. Join the effort to reduce carbon footprints.</p>
        </div>
        <button onClick={() => handleParticipate('Tress')}>Participate</button>
      </li>
      <li>
        <img src={imag} alt="Collecting Dust" />
        <div className="contest-info">
          <h2>Collecting Dust</h2>
          <p>Join the dust collection initiative to clean up urban spaces and improve air quality.</p>
        </div>
        <button onClick={() => handleParticipate('dust')}>Participate</button>
      </li> <li>
        <img src={imag} alt="Collecting Dust" />
        <div className="contest-info">
          <h2>Water Conservation Challenge</h2>
          <p>Join the dust collection initiative to clean up urban spaces and improve air quality.</p>
        </div>
        <button onClick={() => handleParticipate('water')}>Participate</button>
      </li> <li>
        <img src={imag} alt="Collecting Dust" />
        <div className="contest-info">
          <h2>Cleanup Events</h2>
          <p>Join the dust collection initiative to clean up urban spaces and improve air quality.</p>
        </div>
        <button onClick={() => handleParticipate('energy')}>Participate</button>
      </li>
      <li>
        <img src={imag} alt="Collecting Dust"/>
        <div className="contest-info">
          <h2>Recycling Challenge</h2>
          <p>Join the dust collection initiative to clean up urban spaces and improve air quality.</p>
        </div>
        <button onClick={() => handleParticipate('recycle')}>Participate</button>``
      </li>
    </ol>
  </div>
</section>
<Envibuy/>
    </>
  );
}
