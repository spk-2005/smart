import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './contest.css';
import axios from 'axios';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase'; // Adjust the path as necessary

export default function Contest() {
    const { contest } = useParams();
    const videoRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const recordedChunksRef = useRef([]);
    const [stream, setStream] = useState(null);
    const storedname = localStorage.getItem('name');
    const storedemail = localStorage.getItem('email');

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = mediaStream;
            setStream(mediaStream);
            console.log('MediaStream initialized:', mediaStream);
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Unable to access the camera. Please check your permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const startRecording = () => {
        const mediaStream = videoRef.current.srcObject;
        const recorder = new MediaRecorder(mediaStream);

        recordedChunksRef.current = [];

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunksRef.current.push(event.data);
                console.log('Recording chunk:', event.data);
            } else {
                console.error('Received an empty chunk');
            }
        };

        recorder.onstart = () => {
            console.log('Recording started');
        };

        recorder.onstop = async () => {
            console.log('Recording stopped');
            if (recordedChunksRef.current.length === 0) {
                console.error('No recorded chunks available');
                alert('No video data recorded. Please try again.');
                return;
            }

            const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${contest}_planting_video.webm`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);

            const videoUrl = await uploadToFirebase(blob);
            if (videoUrl) {
                console.log("Video uploaded successfully and URL generated:", videoUrl);
                await uploadToAirtable(videoUrl);
            }
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
        }
        setIsRecording(false);
        stopCamera();
    };

    const uploadToFirebase = async (blob) => {
        const timestamp = Date.now();
        const videoRef = ref(storage, `videos/${timestamp}-${contest}.mp4`);
        const metadata = { contentType: 'video/mp4' };

        try {
            console.log('Uploading MP4 blob to Firebase:', blob);
            await uploadBytes(videoRef, blob, metadata);
            const videoUrl = await getDownloadURL(videoRef);
            console.log('Download URL:', videoUrl);
            return videoUrl;
        } catch (error) {
            console.error('Error uploading video to Firebase:', error);
            alert('There was an error uploading your video to Firebase.');
            return null;
        }
    };

    const uploadToAirtable = async (videoUrl) => {
        // Check if user is signed in
        if (!storedname || !storedemail) {
            alert('Please sign in to upload your video.');
            return; // Exit the function if not signed in
        }

        const currentDate = new Date();
        const dateString = currentDate.toISOString().split('T')[0];
        const timeString = currentDate.toLocaleTimeString();

        try {
            const apiKey = 'pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061'; // Use environment variable
            const treesUrl = `https://api.airtable.com/v0/appfQNmAs6vTN5iAn/trees`;

            const treeData = {
                fields: {
                    contestname: contest,
                    name: storedname,
                    email: storedemail,
                    Date: dateString,
                    time: timeString,
                    Video: [
                        {
                            url: videoUrl,
                            filename: `${contest}_${storedname}_video.webm`,
                        },
                    ],
                },
            };

            console.log('Tree Data being sent to Airtable:', treeData);
            await axios.post(treesUrl, treeData, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('Video uploaded and record created in the trees table.');
        } catch (error) {
            console.error('Error uploading video or updating Airtable:', error);
            alert('There was an error uploading your video. Please check your network connection and try again.');
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
            if (mediaRecorder) {
                mediaRecorder.stop();
            }
        };
    }, []);

    return (
        <section id="main-cont">
            <div id="docont">
                <h1>Welcome to the {contest} Contest</h1>
                <p>
                    Join the {contest} contest and contribute to a greener planet by planting trees! This initiative focuses on promoting sustainability and environmental awareness. Each participant is required to plant trees, which help in restoring the ecological balance, purifying the air, and providing a better future for generations to come.
                </p>
                <h2>Rules & Regulations</h2>
                <ol>
                    <li>Each participant must plant a minimum of 3 trees and record the process clearly in real-time.</li>
                    <li>Trees must be planted live, and the recording should show clear steps from start to finish.</li>
                    <li>Manipulated or pre-recorded footage will result in disqualification.</li>
                    <li>Planting fruit-bearing or native trees is highly encouraged for a stronger environmental impact.</li>
                </ol>
                <button onClick={startCamera}>Start Camera</button>
            </div>

            <div id="live-camera">
                <h2>Record Your Tree Planting Activity</h2>
                <video ref={videoRef} autoPlay muted></video>
                <div>
                    {isRecording ? (
                        <button onClick={stopRecording}>Stop Recording</button>
                    ) : (
                        <button onClick={startRecording}>Start Recording</button>
                    )}
                </div>
            </div>
        </section>
    );
}
