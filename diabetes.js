import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Diabetes() {
  const storedname = localStorage.getItem('name');
  const storedemail = localStorage.getItem('email');
  const [capturedImages, setCapturedImages] = useState({});
  const [activeSections, setActiveSections] = useState({
    Breakfast: false,
    Lunch: false,
    Dinner: false,
    Snacks: false,
  });
  const [mealCompletion, setMealCompletion] = useState({
    Breakfast: false,
    Lunch: false,
    Dinner: false,
    Snacks: false,
  });
  const [statusMessage, setStatusMessage] = useState("");
  const videoRefs = useRef({});
  const canvasRefs = useRef({});

  const timeRanges = {
    Breakfast: { start: 6, end: 9},
    Lunch: { start: 12, end: 18},
    Dinner: { start: 18, end: 20 },
    Snacks: { start: 16, end: 18 },
  };

  useEffect(() => {
    checkTimeForSections();
    const interval = setInterval(checkTimeForSections, 600000);
    return () => clearInterval(interval);
  }, []);

  const checkTimeForSections = () => {
    const currentHour = new Date().getHours();
    const newActiveSections = {};

    for (const meal in timeRanges) {
      const { start, end } = timeRanges[meal];
      newActiveSections[meal] = currentHour >= start && currentHour < end;
    }

    setActiveSections(newActiveSections);
  };

  const startCamera = (mealType) => {
    if (!mealCompletion[mealType]) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRefs.current[mealType]) {
            videoRefs.current[mealType].srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
        });
    }
  };

  const captureImage = (mealType) => {
    const canvas = canvasRefs.current[mealType];
    const context = canvas.getContext('2d');
    context.drawImage(videoRefs.current[mealType], 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png');
    const imageBlob = dataURItoBlob(imageData);

    if (imageBlob.size > 0) {
      setCapturedImages((prev) => ({
        ...prev,
        [mealType]: imageData,
      }));
    }

    stopCamera(mealType);
  };

  const stopCamera = (mealType) => {
    const stream = videoRefs.current[mealType]?.srcObject;
    const tracks = stream?.getTracks();
    tracks?.forEach((track) => track.stop());
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
  };
  const checkAndUpload = async (mealType) => {
    const currentDate = new Date().toLocaleDateString();
    const airtableUrl = `https://api.airtable.com/v0/appfQNmAs6vTN5iAn/diabetes`;
    const apiKey = 'pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061';
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };
  
    // Check if entry exists for today
    const queryUrl = `${airtableUrl}?filterByFormula=AND({name}="${storedname}",{email}="${storedemail}",{mealType}="${mealType}")`;
  
    try {
      const response = await axios.get(queryUrl, { headers });
      const existingRecords = response.data.records;
  
      if (existingRecords.length > 0) {
        setStatusMessage(`You have already logged your ${mealType} for today.`);
        return;
      } else {
        // Proceed with upload
        uploadToFirebase(mealType);
      }
    } catch (error) {
      console.error("Error checking meal completion data:", error);
      setStatusMessage("An error occurred while checking your meal entry. Please try again.");
    }
  };
  
  const uploadToFirebase = async (mealType) => {
    const capturedImage = capturedImages[mealType];
    if (!capturedImage) return;

    const currentDate = new Date().toLocaleDateString();
    try {
      const imageRef = ref(storage, `images/${mealType}-${Date.now()}.png`);
      const imageBlob = dataURItoBlob(capturedImage);
      await uploadBytes(imageRef, imageBlob);

      const imageUrl = await getDownloadURL(imageRef);
      const currentTime = new Date().toLocaleTimeString();

      const airtableUrl = `https://api.airtable.com/v0/appfQNmAs6vTN5iAn/diabetes`;
      const apiKey = 'pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061';
      const headers = {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      };

      const mealData = {
        fields: {
          image: [{ url: imageUrl }],
        },
      };

      await axios.post(airtableUrl, { records: [mealData] }, { headers });

      setMealCompletion((prev) => ({
        ...prev,
        [mealType]: true,
      }));

      setStatusMessage(`Successfully uploaded ${mealType} entry!`);
      setCapturedImages((prev) => ({
        ...prev,
        [mealType]: null,
      }));

      setTimeout(() => setStatusMessage(""), 3000);
    } catch (error) {
      console.error("Error uploading image:", error);
      setStatusMessage(`Error uploading ${mealType} image. Please try again.`);
    }
  };

  return (
    <section>
      <h1>Diabetes Meal Tracker</h1>

      {statusMessage && <p>{statusMessage}</p>}

      {Object.keys(timeRanges).map((mealType) => (
        <div key={mealType} style={{ marginBottom: '30px' }}>
          <h2>{mealType}</h2>

          {mealCompletion[mealType] ? (
            <p>You had your {mealType} successfully for today.</p>
          ) : activeSections[mealType] ? (
            <>
              {!capturedImages[mealType] && (
                <button onClick={() => startCamera(mealType)}>Start Camera</button>
              )}

              <video
                ref={(el) => (videoRefs.current[mealType] = el)}
                autoPlay
                width="300"
                height="300"
                style={{ border: '2px solid black' }}
              ></video>

              {!capturedImages[mealType] && (
                <button onClick={() => captureImage(mealType)}>Capture Image</button>
              )}

              <canvas
                ref={(el) => (canvasRefs.current[mealType] = el)}
                width="300"
                height="300"
                style={{ display: 'none' }}
              ></canvas>

              {capturedImages[mealType] && (
                <>
                  <img src={capturedImages[mealType]} alt={`Captured ${mealType}`} />
                  <button onClick={() => checkAndUpload(mealType)}>Upload</button>
                </>
              )}
            </>
          ) : (
            <p>{mealType} time is not yet available.</p>
          )}
        </div>
      ))}
    </section>
  );
}
