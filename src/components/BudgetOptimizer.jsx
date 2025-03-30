import React, { useState } from "react";
import axios from "axios";
import "./BudgetOptimizer.css";

function BudgetOptimizer() {
    const [eventName, setEventName] = useState("");
    const [eventType, setEventType] = useState("");
    const [eventScale, setEventScale] = useState("");
    const [optimizedBudget, setOptimizedBudget] = useState(null);
    const [error, setError] = useState("");

    const fetchOptimizedBudget = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/predict_budget", {
                event_name: eventName,
                event_type: eventType,
                event_scale: eventScale
            });

            setOptimizedBudget(response.data.optimized_budget);
        } catch (error) {
            setError("Error fetching budget data. Please try again.");
        }
    };

    return (
        <div className="budget-optimizer-container">
            <h2>Predictive Budget Optimization</h2>

            <input
                type="text"
                placeholder="Event Name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Event Type (e.g., Seminar, Hackathon)"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
            />
            <input
                type="text"
                placeholder="Event Scale (Small, Medium, Large)"
                value={eventScale}
                onChange={(e) => setEventScale(e.target.value)}
            />
            <button onClick={fetchOptimizedBudget}>Get Budget Optimization</button>

            {error && <p className="error-message">{error}</p>}

            {optimizedBudget && (
                <div className="budget-results">
                    <h3>Optimized Budget Allocation:</h3>
                    <p>Venue Cost: ${optimizedBudget.venue_cost.toFixed(2)}</p>
                    <p>Marketing: ${optimizedBudget.marketing.toFixed(2)}</p>
                    <p>Speakers: ${optimizedBudget.speakers.toFixed(2)}</p>
                    <p>Miscellaneous: ${optimizedBudget.misc.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
}

export default BudgetOptimizer;
