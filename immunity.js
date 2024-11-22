import React, { useState } from 'react';
import './immunity.css';

// Example seed images (replace with actual paths)
import chiaImage from './gut.jpg';
import flaxseedImage from './gut.jpg';
import pumpkinImage from './gut.jpg';
import sunflowerImage from './gut.jpg';
import sesameImage from './gut.jpg';
import Healbuy from './healbuy';

export default function NutrientQuest() {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [unlockedSeeds, setUnlockedSeeds] = useState([]);
  const [clickedSeed, setClickedSeed] = useState(null);

  const seeds = [
    {
      id: 1,
      name: 'Chia Seeds',
      benefits: 'Rich in omega-3 fatty acids, fiber, and antioxidants. Helps boost immune function and support heart health.',
      funFact: 'Did you know? Chia seeds absorb up to 12 times their weight in water, making them a great hydration booster!',
      challenge: 'Add chia seeds to your breakfast smoothie tomorrow!',
      image: chiaImage,
    },
    {
      id: 2,
      name: 'Flaxseeds',
      benefits: 'High in lignans and essential fatty acids, they help reduce inflammation and support brain function.',
      funFact: 'Flaxseeds have been cultivated since 3000 BC! They’re one of the oldest crops known to humanity.',
      challenge: 'Sprinkle flaxseeds on your next salad or yogurt for a brain-boosting meal.',
      image: flaxseedImage,
    },
    {
      id: 3,
      name: 'Pumpkin Seeds',
      benefits: 'Packed with zinc, magnesium, and antioxidants, they strengthen the immune system and improve bone health.',
      funFact: 'Pumpkin seeds were part of the Aztec diet. They called them “pepitas,” meaning “little seeds.”',
      challenge: 'Snack on roasted pumpkin seeds today instead of chips!',
      image: pumpkinImage,
    },
    {
      id: 4,
      name: 'Sunflower Seeds',
      benefits: 'Loaded with vitamin E and selenium, these seeds protect cells from damage and support immunity.',
      funFact: 'Sunflowers follow the sun! Their heads turn throughout the day to face it – it’s called heliotropism.',
      challenge: 'Add sunflower seeds to your granola for a vitamin E boost.',
      image: sunflowerImage,
    },
    {
      id: 5,
      name: 'Sesame Seeds',
      benefits: 'Rich in essential minerals like calcium, iron, and zinc, sesame seeds help fight anemia and improve immune response.',
      funFact: 'Open Sesame! Sesame seeds come from a flower that opens its pods when fully mature, revealing the seeds inside.',
      challenge: 'Try adding sesame seeds to your stir-fry for an iron-rich meal!',
      image: sesameImage,
    },
  ];

  const handleNextLevel = (seed) => {
    if (!unlockedSeeds.includes(seed.id) && seed.id === currentLevel) {
      setUnlockedSeeds([...unlockedSeeds, seed.id]);
      setClickedSeed(seed.id);
      setCurrentLevel((prevLevel) => prevLevel + 1);
    }
  };

  return (
    <>
    <section className="nutrient-quest-section">
      <div className="quest-header">
        <h2>Welcome to the Nutrient Quest!</h2>
        <p>
          Embark on an exciting journey to unlock super seeds and fight nutrient deficiency! Complete each level by learning fun facts, accepting challenges, and improving your diet. Are you ready for the quest?
        </p>
        <div className="level-indicator">
          <h3>Level {currentLevel}</h3>
        </div>
      </div>

      <div className="seeds-grid">
        {seeds.slice(0, currentLevel).map((seed, index) => (
          <div
            key={index}
            className={`seed-card ${unlockedSeeds.includes(seed.id) ? 'unlocked' : ''}`}
            onClick={() => handleNextLevel(seed)}
          >
            <h3>{seed.name}</h3>
          </div>
        ))}
      </div>

      {clickedSeed && (
        <div className={`unlocked-seed-info anim-slide-up`}>
          <h3>Congratulations! You've unlocked:</h3>
          {unlockedSeeds.map((id) => {
            const seed = seeds.find((s) => s.id === id);
            return (
              <div key={seed.id} className="seed-info">
                <img src={seed.image} alt={seed.name} className="seed-image anim-zoom-in" />
                <h4>{seed.name}</h4>
                <p className="seed-benefits"><strong>Benefits:</strong> {seed.benefits}</p>
                <p className="seed-funfact"><strong>Fun Fact:</strong> {seed.funFact}</p>
                <p className="seed-challenge"><strong>Challenge:</strong> {seed.challenge}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className="game-status">
        {currentLevel <= seeds.length ? (
          <p>Complete this level to unlock the next super seed!</p>
        ) : (
          <p>Congratulations! You've completed the Nutrient Quest and unlocked all the super seeds!</p>
        )}
      </div>
    </section>
    <Healbuy/>
    </>
  );
}
