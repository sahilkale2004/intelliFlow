import React, { useState } from "react";
import axios from "axios";
import "./speakers_judges.css";  

function SpeakersRecommendations() {
    const [theme, setTheme] = useState("");
    const [budget, setBudget] = useState("");
    const [date, setDate] = useState("");
    const [role, setRole] = useState("speaker");
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState("");

    const fetchRecommendations = async () => {
        try {
            setError(""); // Reset error before new request
            
            if (!theme || !budget || isNaN(Number(budget))) {
                setError("Please enter valid theme and budget.");
                return;
            }

            const response = await axios.post("http://127.0.0.1:5000/recommend_speakers", {
                theme: theme.trim().toLowerCase(),  // Corrected: Changed 'expertise' to 'theme'
                budget: Number(budget),
                role: role.trim().toLowerCase(),
                date: date,
            });

            console.log("API Response:", response.data);

            if (response.data.recommendations.length > 0) {
                setRecommendations(response.data.recommendations);
            } else {
                setRecommendations([]);
                setError("No matching recommendations found.");
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            setError("Failed to fetch recommendations. Please try again.");
        }
    };

    return (
        <div className="speaker-container">
            <h2>AI-Powered Speaker & Judge Recommendations</h2>

            <input
                type="text"
                placeholder="Theme (e.g., AI, Cybersecurity)"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
            />
            <input
                type="number"
                placeholder="Budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <select value={role} onChange={(e) => setRole(e.target.value.toLowerCase())}>
                <option value="speaker">Speaker</option>
                <option value="judge">Judge</option>
            </select>
            <button onClick={fetchRecommendations}>Get Recommendations</button>

            {error && <p className="error-message">{error}</p>}  

            <h3>Recommended {role}s:</h3>
            {recommendations.length > 0 ? (
                <ul>
                    {recommendations.map((rec, index) => (
                        <li key={index}>
                            <strong>{rec.name}</strong> - {rec.expertise} <br />
                            Budget: ${rec.budget} | Rating: {rec.rating}/5
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No matching {role}s found.</p>
            )}
        </div>
    );
}

export default SpeakersRecommendations;
