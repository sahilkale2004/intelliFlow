import React, { useState } from "react";
import axios from "axios";
import "./speakers_judges.css";  

function SpeakersRecommendations() {
    const [theme, setTheme] = useState("");
    const [budget, setBudget] = useState("");
    const [date, setDate] = useState("");
    const [role, setRole] = useState("Speaker");
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState("");  

    // Fetch recommended speakers or judges
    const fetchRecommendations = async () => {
        try {
            setError("");  
            const response = await axios.post("http://localhost:5005/recommend_speakers", {
                theme,
                budget: Number(budget),  
                date,
                role,
            });
            
            console.log("API Response:", response.data);
            if (response.data.error) {
                setError(response.data.error);  
                setRecommendations([]);
            } else {
                setRecommendations(response.data.recommendations || []);
            }
        } catch (error) {
            console.error("Error fetching recommendations:", error);
            setError("Failed to fetch recommendations. Please try again.");
            setRecommendations([]);
        }
    };

    return (
        <div className="speaker-container">
            <h2>AI-Powered Speaker & Judge Recommendations</h2>

            <input
                type="text"
                placeholder="Event Theme"
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
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Speaker">Speaker</option>
                <option value="Judge">Judge</option>
            </select>
            <button onClick={fetchRecommendations}>Get Recommendations</button>

            {error && <p>{error}</p>}  

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
