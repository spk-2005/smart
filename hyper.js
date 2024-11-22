import React, { useState, useEffect } from 'react';
import './hyper.css';

export default function Hyper() {
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const [phase, setPhase] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [cycleComplete, setCycleComplete] = useState(false);
    const [credits, setCredits] = useState(0);
    const [dailyCount, setDailyCount] = useState(0); // Start with 0

    const currentDate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

    useEffect(() => {
        fetchDailyCount();
    }, []);

    const fetchDailyCount = async () => {
        try {
            const response = await fetch(`https://api.airtable.com/v0/appfQNmAs6vTN5iAn/hyper?filterByFormula=AND({date}='${currentDate}', {email}='${email}')`, {
                headers: {
                    Authorization: 'Bearer pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061',
                },
            });
            const result = await response.json();
            if (result.records.length > 0) {
                const record = result.records[0];
                setDailyCount(Math.min(2, record.fields.bc)); // Set to the existing bc or cap at 2
            } else {
                setDailyCount(0); // No record found, start with 0
            }
        } catch (error) {
            console.error("Error fetching daily count:", error);
        }
    };

    const startCycle = () => {
        if (dailyCount >= 2) return; // Prevent starting if max cycles are completed
        setCycleComplete(false);
        setPhase('inhale');
        setTimeLeft(4);
    };

    // Transition through the phases
    useEffect(() => {
        let timer;
        if (timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else {
            if (phase === 'inhale') {
                setPhase('hold');
                setTimeLeft(7);
            } else if (phase === 'hold') {
                setPhase('exhale');
                setTimeLeft(8);
            } else if (phase === 'exhale') {
                setCycleComplete(true);
                if (dailyCount < 2) {
                    updateDailyCycleCount();
                }
            }
        }
        return () => clearInterval(timer);
    }, [timeLeft, phase]);

    const updateDailyCycleCount = async () => {
        const newCount = dailyCount + 1;
        setDailyCount(newCount);

        const response = await fetch(`https://api.airtable.com/v0/appfQNmAs6vTN5iAn/hyper?filterByFormula=AND({date}='${currentDate}', {email}='${email}')`, {
            headers: {
                Authorization: 'Bearer pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061',
            },
        });
        const result = await response.json();

        if (result.records.length > 0) {
            const recordId = result.records[0].id;
            const data = {
                records: [
                    {
                        id: recordId,
                        fields: { bc: newCount },
                    },
                ],
            };
            await fetch(`https://api.airtable.com/v0/appfQNmAs6vTN5iAn/hyper`, {
                method: 'PATCH',
                headers: {
                    Authorization: 'Bearer pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
        } else {
            logNewRecordToAirtable(newCount);
        }
    };

    const logNewRecordToAirtable = async (newCount) => {
        const currentTime = new Date().toTimeString().split(' ')[0];
        const data = {
            records: [
                {
                    fields: {
                        name: name,
                        email: email,
                        date: currentDate,
                        time: currentTime,
                        bc: newCount,
                    },
                },
            ],
        };

        try {
            await fetch('https://api.airtable.com/v0/appfQNmAs6vTN5iAn/hyper', {
                method: 'POST',
                headers: {
                    Authorization: 'Bearer pataRZ3DHSFEkG4y5.990679aa58294bb7876ba2b2450d1c3b79ef7c49cf4754557f69d0e5e07e2061',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            console.log("New record saved to Airtable");
        } catch (error) {
            console.error("Error saving new record to Airtable:", error);
        }
    };

    return (
        <>
            <section id="hyper">
                <div id="hyper-cont">
                    <h2>4-7-8 Breathing Exercise</h2>
                    {cycleComplete && dailyCount < 2 ? (
                        <div id="complete-message">
                            <p>Congratulations! You've completed a cycle.</p>
                            <button onClick={startCycle} disabled={dailyCount >= 2}>Start Again</button>
                        </div>
                    ) : (
                        <div id="breathing-exercise">
                            <p>Current Phase: <strong>{phase}</strong></p>
                            <p>Time Left: {timeLeft}s</p>
                            <button onClick={startCycle} disabled={phase}>Start Breathing Cycle</button>
                        </div>
                    )}
                    <p>Daily Cycles Completed: {dailyCount}/2</p>
                    <p>Total Credits: {credits}</p>
                </div>
            </section>
        </>
    );
}
